const Bill = require("../models/Bill");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const PrimaryCare = require("../models/PrimaryCare");
const User = require("../models/User");

const { Op, fn, col, where } = require("sequelize");
const { parseMonthParam } = require("../utils/helpers/dateHelper");
const { success, error } = require("../utils/helpers/responseHelper");

// Create a new bill
exports.createBill = async (req, res) => {
  const t = await Bill.sequelize.transaction();

  try {
    let patientId = req.body.patientId;

    // 👇 If no patient in DB, create it first
    if (!req.body.isPatientFound) {
      const { name, age, ageMonths, gender, phone } = req.body;

      if (!name || !phone || !gender) {
        return error(res, "Patient details missing", 400);
      }

      const newPatient = await Patient.create(
        { name, age, ageMonths, gender, phone },
        { transaction: t }
      );
      patientId = newPatient.id;
    }

    // ✅ Only keep allowed Bill fields
    const billPayload = {
      idNo: req.body.idNo,
      date: req.body.date,
      time: req.body.time,
      receptionistId: req.body.receptionistId,
      billType: req.body.billType,
      grossAmount: req.body.grossAmount,
      discount: req.body.discount,
      extraDiscount: req.body.extraDiscount,
      totalAmount: req.body.totalAmount,
      receivedAmount: req.body.receivedAmount,
      due: req.body.due,
      doctorReferralId: req.body.doctorReferralId,
      doctorReferralFee: req.body.doctorReferralFee,
      pcReferralId: req.body.pcReferralId,
      pcReferralFee: req.body.pcReferralFee,
      selectedTests: req.body.selectedTests,
      visitedDoctorId: req.body.visitedDoctorId,
      doctorFee: req.body.doctorFee,
      patientId, // 👈 final patientId only
    };

    const bill = await Bill.create(billPayload, { transaction: t });
    await t.commit();

    return success(res, { insertId: bill.id, patientId }, "Bill saved");
  } catch (err) {
    await t.rollback();
    return error(res, err);
  }
};

// Get all bills (optionally filter by date)
exports.getAllBills = async (req, res) => {
  try {
    const date = req.query.date;
    const filter = { archive: false }; // exclude archived bills
    if (date) filter.date = date;

    const bills = await Bill.findAll({
      where: filter,
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
      ],
      paranoid: true, // ✅ exclude soft-deleted bills
      include: [
        {
          model: Patient,
          as: "patient",
        },
        {
          model: User,
          as: "receptionist",
          attributes: ["id", "username", "email"],
        },
        {
          model: Doctor,
          as: "visitedDoctor",
          attributes: ["id", "name", "specialization"],
        },
        {
          model: Doctor,
          as: "doctorReferral",
          attributes: ["id", "name", "specialization"],
        },
        {
          model: PrimaryCare,
          as: "pcReferral",
          attributes: ["id", "name"],
        },
      ],
    });

    return success(res, bills);
  } catch (err) {
    return error(res, err);
  }
};

// Get archived bills
exports.getArchivedBills = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      where: { archive: true },
      order: [["archivedAt", "DESC"]],
      paranoid: true, // ✅ still exclude soft-deleted
      include: [
        {
          model: Patient,
          as: "patient",
        },
        {
          model: User,
          as: "receptionist",
          attributes: ["id", "username", "email"],
        },
        {
          model: Doctor,
          as: "visitedDoctor",
          attributes: ["id", "name", "specialization"],
        },
        {
          model: Doctor,
          as: "doctorReferral",
          attributes: ["id", "name", "specialization"],
        },
        {
          model: PrimaryCare,
          as: "pcReferral",
          attributes: ["id", "name"],
        },
      ],
    });

    return success(res, bills);
  } catch (err) {
    return error(res, err);
  }
};

// Archive a bill
exports.archiveBill = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return error(res, "Bill not found", 404);

    await bill.update({ archive: true, archivedAt: new Date() });
    return success(res, bill, "Bill archived successfully");
  } catch (err) {
    return error(res, err);
  }
};

// Restore an archived bill
exports.restoreBill = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return error(res, "Bill not found", 404);

    await bill.update({ archive: false });
    return success(res, bill, "Bill restored successfully");
  } catch (err) {
    return error(res, err);
  }
};

// Clear due of a bill
exports.clearBillDue = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return error(res, "Bill not found", 404);

    await bill.update({ due: 0, receivedAmount: bill.totalAmount });
    return success(res, bill, "Bill due cleared");
  } catch (err) {
    return error(res, err);
  }
};

// Delete a bill (hard delete)
exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return error(res, "Bill not found", 404);

    await bill.destroy(); // soft delete -> sets deletedAt
    return success(res, null, "Bill archived (soft deleted) successfully");
  } catch (err) {
    return error(res, err);
  }
};

// Monthly stats
exports.billStats = async (req, res) => {
  const parsed = parseMonthParam(req.query.month);
  if (parsed.error) return error(res, parsed.error, 400);

  const { year, month } = parsed;

  try {
    const totalMonthlyAmount = await Bill.sum("totalAmount", {
      where: {
        archive: false,
        [Op.and]: [
          where(fn("MONTH", col("date")), month),
          where(fn("YEAR", col("date")), year),
        ],
      },
    });

    const totalByType = await Bill.findAll({
      attributes: ["billType", [fn("SUM", col("totalAmount")), "totalByType"]],
      where: {
        archive: false,
        [Op.and]: [
          where(fn("MONTH", col("date")), month),
          where(fn("YEAR", col("date")), year),
        ],
      },
      group: ["billType"],
    });

    const dailyTotals = await Bill.findAll({
      attributes: [
        [fn("DATE", col("date")), "day"],
        [fn("SUM", col("totalAmount")), "totalPerDay"],
      ],
      where: {
        archive: false,
        [Op.and]: [
          where(fn("MONTH", col("date")), month),
          where(fn("YEAR", col("date")), year),
        ],
      },
      group: [fn("DATE", col("date"))],
      order: [[fn("DATE", col("date")), "ASC"]],
    });

    const dailyTotalsByType = await Bill.findAll({
      attributes: [
        [fn("DATE", col("date")), "day"],
        "billType",
        [fn("SUM", col("totalAmount")), "totalPerDayByType"],
      ],
      where: {
        archive: false,
        [Op.and]: [
          where(fn("MONTH", col("date")), month),
          where(fn("YEAR", col("date")), year),
        ],
      },
      group: [fn("DATE", col("date")), "billType"],
      order: [
        [fn("DATE", col("date")), "ASC"],
        ["billType", "ASC"],
      ],
    });

    return success(res, {
      totalMonthlyAmount,
      totalByType,
      dailyTotals,
      dailyTotalsByType,
    });
  } catch (err) {
    return error(res, err);
  }
};

// Referral earnings (Doctor + PrimaryCare)
exports.referralEarnings = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return error(
        res,
        "Please provide both 'from' and 'to' query params.",
        400,
        "Error"
      );
    }

    // Doctor referrals (group + details)
    const doctorReferrals = await Bill.findAll({
      attributes: [
        "doctorReferralId",
        [fn("SUM", col("doctorReferralFee")), "totalEarnings"],
      ],
      where: {
        doctorReferralId: { [Op.ne]: null },
        archive: false,
        date: { [Op.between]: [from, to] },
      },
      group: ["doctorReferralId"],
      raw: true,
    });

    // Fetch all bills for doctors in range
    const doctorBills = await Bill.findAll({
      where: {
        doctorReferralId: { [Op.ne]: null },
        archive: false,
        date: { [Op.between]: [from, to] },
      },
      include: [
        { model: Doctor, as: "doctorReferral", attributes: ["id", "name"] },
      ],
    });

    // Attach grouped bills
    const doctorReferralsWithBills = doctorReferrals.map((ref) => {
      const bills = doctorBills
        .filter((b) => b.doctorReferralId === ref.doctorReferralId)
        .map((b) => ({
          id: b.id,
          idNo: b.idNo,
          date: b.date,
          patientId: b.patientId,
          doctorReferralFee: b.doctorReferralFee,
          grossAmount: b.grossAmount,
        }));

      const doctor = doctorBills.find(
        (b) => b.doctorReferralId === ref.doctorReferralId
      )?.doctorReferral;

      return {
        id: ref.doctorReferralId,
        name: doctor?.name || "Unknown Doctor",
        totalEarnings: parseFloat(ref.totalEarnings || 0),
        bills,
      };
    });

    // PrimaryCare referrals (group + details)
    const pcReferrals = await Bill.findAll({
      attributes: [
        "pcReferralId",
        [fn("SUM", col("pcReferralFee")), "totalEarnings"],
      ],
      where: {
        pcReferralId: { [Op.ne]: null },
        archive: false,
        date: { [Op.between]: [from, to] },
      },
      group: ["pcReferralId"],
      raw: true,
    });

    const pcBills = await Bill.findAll({
      where: {
        pcReferralId: { [Op.ne]: null },
        archive: false,
        date: { [Op.between]: [from, to] },
      },
      include: [
        { model: PrimaryCare, as: "pcReferral", attributes: ["id", "name"] },
      ],
    });

    const pcReferralsWithBills = pcReferrals.map((ref) => {
      const bills = pcBills
        .filter((b) => b.pcReferralId === ref.pcReferralId)
        .map((b) => ({
          id: b.id,
          idNo: b.idNo,
          date: b.date,
          patientId: b.patientId,
          pcReferralFee: b.pcReferralFee,
          grossAmount: b.grossAmount,
        }));

      const pc = pcBills.find(
        (b) => b.pcReferralId === ref.pcReferralId
      )?.pcReferral;

      return {
        id: ref.pcReferralId,
        name: pc?.name || "Unknown PC",
        totalEarnings: parseFloat(ref.totalEarnings || 0),
        bills,
      };
    });

    // Total distributed amount
    const total = [...doctorReferralsWithBills, ...pcReferralsWithBills].reduce(
      (sum, r) => sum + r.totalEarnings,
      0
    );

    return success(res, {
      doctorReferrals: doctorReferralsWithBills,
      pcReferrals: pcReferralsWithBills,
      totalDistributedAmount: total,
    });
  } catch (err) {
    return error(res, err);
  }
};

// grossAmount - discount - extraDiscount = netAmount
// netAmount = receivedAmount + due
// totalAmount = netAmount
