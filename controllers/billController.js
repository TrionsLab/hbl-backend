const Bill = require('../models/bill');
const DeletedBill = require('../models/deletedBill');
const { Op, fn, col, where } = require('sequelize');

exports.createBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json({ message: 'Bill saved', insertId: bill.id });
  } catch (err) {
    res.status(500).json({ message: 'DB Error', error: err });
  }
};

exports.getAllBills = async (req, res) => {
  try {
    const date = req.params.date || req.query.date;
    console.log(req.params.date)
    const where = date ? { date } : {};
    const bills = await Bill.findAll({
      where,
      order: [['date', 'DESC'], ['time', 'DESC']],
    });
    res.status(200).json(bills);
    console.log(bills)
  } catch (err) {
      console.error('Error fetching bills:', err);
    res.status(500).json({ message: 'DB Error', error: err });
  }
};

exports.getLastReceipt = async (req, res) => {
  try {
    const bill = await Bill.findOne({
      order: [['date', 'DESC'], ['time', 'DESC']],
    });
    if (!bill) return res.status(404).json({ message: 'No bills found' });
    res.status(200).json(bill);
  } catch (err) {
    res.status(500).json({ message: 'DB Error', error: err });
  }
};

exports.billStats = async (req, res) => {
  const monthParam = req.query.month;

  if (!monthParam || !/^\d{4}-\d{2}$/.test(monthParam)) {
    return res.status(400).json({ message: 'Invalid month format. Use YYYY-MM' });
  }

  const [year, month] = monthParam.split('-').map(Number);

  try {
    const totalMonthlyAmount = await Bill.sum('totalAmount', {
      where: {
        [Op.and]: [
          where(fn('MONTH', col('date')), month),
          where(fn('YEAR', col('date')), year),
        ]
      }
    });

    const totalByType = await Bill.findAll({
      attributes: [
        'billType',
        [fn('SUM', col('totalAmount')), 'totalByType']
      ],
      where: {
        [Op.and]: [
          where(fn('MONTH', col('date')), month),
          where(fn('YEAR', col('date')), year),
        ]
      },
      group: ['billType']
    });

    const dailyTotals = await Bill.findAll({
      attributes: [
        [fn('DATE', col('date')), 'day'],
        [fn('SUM', col('totalAmount')), 'totalPerDay']
      ],
      where: {
        [Op.and]: [
          where(fn('MONTH', col('date')), month),
          where(fn('YEAR', col('date')), year),
        ]
      },
      group: [fn('DATE', col('date'))],
      order: [[fn('DATE', col('date')), 'ASC']]
    });

    const dailyTotalsByType = await Bill.findAll({
      attributes: [
        [fn('DATE', col('date')), 'day'],
        'billType',
        [fn('SUM', col('totalAmount')), 'totalPerDayByType']
      ],
      where: {
        [Op.and]: [
          where(fn('MONTH', col('date')), month),
          where(fn('YEAR', col('date')), year),
        ]
      },
      group: [fn('DATE', col('date')), 'billType'],
      order: [[fn('DATE', col('date')), 'ASC'], ['billType', 'ASC']]
    });

    res.status(200).json({
      totalMonthlyAmount,
      totalByType,
      dailyTotals,
      dailyTotalsByType,
    });
  } catch (err) {
    res.status(500).json({ message: 'DB Error', error: err.message });
  }
};

exports.referralEarnings = async (req, res) => {
  const monthParam = req.query.month;

  // Validate month format
  if (!monthParam || !/^\d{4}-\d{2}$/.test(monthParam)) {
    return res.status(400).json({ message: 'Invalid month format. Use YYYY-MM' });
  }

  const [year, month] = monthParam.split('-').map(Number);

  try {
    // Doctor Referrals
    const doctorReferrals = await Bill.findAll({
      attributes: [
        ['referralDoctorName', 'name'],
        [fn('SUM', col('referralDoctorFee')), 'totalEarnings'],
      ],
      where: {
        referralDoctorName: { [Op.ne]: null },
        [Op.and]: [
          where(fn('MONTH', col('date')), month),
          where(fn('YEAR', col('date')), year),
        ],
      },
      group: ['referralDoctorName'],
    });

    // PC Referrals
    const pcReferrals = await Bill.findAll({
      attributes: [
        ['referralPcName', 'name'],
        [fn('SUM', col('referralPcFee')), 'totalEarnings'],
      ],
      where: {
        referralPcName: { [Op.ne]: null },
        [Op.and]: [
          where(fn('MONTH', col('date')), month),
          where(fn('YEAR', col('date')), year),
        ],
      },
      group: ['referralPcName'],
    });

    // Total distributed earnings
    const total = [...doctorReferrals, ...pcReferrals].reduce(
      (sum, record) => sum + parseFloat(record.get('totalEarnings') || 0),
      0
    );

    res.status(200).json({
      doctorReferrals,
      pcReferrals,
      totalDistributedAmount: total,
    });
  } catch (err) {
    res.status(500).json({ message: 'DB Error', error: err.message });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const billId = req.params.id;
    const bill = await Bill.findByPk(billId);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    // Insert the bill data into deleted_bills with deletedAt timestamp
    await DeletedBill.create({
      ...bill.get(),
      deletedAt: new Date(),
    });

    // Now delete the original bill (force = hard delete)
    await bill.destroy({ force: true });

    res.status(200).json({ message: 'Bill archived and deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'DB Error', error: err.message });
  }
};

exports.clearBillDue = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findByPk(id);
    
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    const updatedBill = await bill.update({
      due: 0,
      paidAmount: bill.totalAmount
    });

    res.status(200).json(updatedBill);
  } catch (err) {
    res.status(500).json({ message: 'Error clearing due', error: err.message });
  }
};
