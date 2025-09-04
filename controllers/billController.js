const Bill = require("../models/Bill_v2");
const Doctor = require("../models/Doctor");
const PrimaryCare = require("../models/PrimaryCare");
const { Op, fn, col, where } = require("sequelize");
const { parseMonthParam } = require("../utils/helpers/dateHelper");
const { success, error } = require("../utils/helpers/responseHelper");

// Create a new bill
exports.createBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    return success(res, { insertId: bill.id }, "Bill saved");
  } catch (err) {
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
  const { year, month, error: parseError } = parseMonthParam(req.query.month);

  if (parseError) {
    return error(res, parseError, 400, "Error");
  }

  try {
    // Doctor referrals
    const doctorReferrals = await Bill.findAll({
      attributes: [
        [col("doctorReferral.name"), "name"],
        [fn("SUM", col("doctorReferral.fee")), "totalEarnings"],
      ],
      include: [
        {
          model: Doctor,
          as: "doctorReferral",
          attributes: [],
        },
      ],
      where: {
        doctorReferralId: { [Op.ne]: null },
        archive: false,
        [Op.and]: [
          where(fn("MONTH", col("Bill.date")), month),
          where(fn("YEAR", col("Bill.date")), year),
        ],
      },
      group: ["doctorReferral.id"],
      raw: true,
    });

    // Primary care referrals
    const pcReferrals = await Bill.findAll({
      attributes: [
        [col("pcReferral.name"), "name"],
        [fn("SUM", col("pcReferral.fee")), "totalEarnings"],
      ],
      include: [
        {
          model: PrimaryCare,
          as: "pcReferral",
          attributes: [],
        },
      ],
      where: {
        pcReferralId: { [Op.ne]: null },
        archive: false,
        [Op.and]: [
          where(fn("MONTH", col("Bill.date")), month),
          where(fn("YEAR", col("Bill.date")), year),
        ],
      },
      group: ["pcReferral.id"],
      raw: true,
    });

    // Merge results
    const referrals = [
      ...doctorReferrals.map((r) => ({ ...r, type: "doctor" })),
      ...pcReferrals.map((r) => ({ ...r, type: "primaryCare" })),
    ];

    const total = referrals.reduce(
      (sum, r) => sum + parseFloat(r.totalEarnings || 0),
      0
    );

    return success(res, {
      referrals,
      totalDistributedAmount: total,
    });
  } catch (err) {
    return error(res, err);
  }
};

// grossAmount - discount - extraDiscount = netAmount
// netAmount = receivedAmount + due
// totalAmount = netAmount
