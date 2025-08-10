const DeletedBill = require('../models/deletedBill');

// GET all deleted bills
exports.getDeletedBills = async (req, res) => {
  try {
    const bills = await DeletedBill.findAll({
      order: [['deletedAt', 'DESC']],
    });
    res.status(200).json(bills);
  } catch (err) {
    console.error('Error fetching deleted bills:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// DELETE a deleted bill by ID
exports.deleteDeletedBill = async (req, res) => {
  try {
    const id = req.params.id;
    const bill = await DeletedBill.findByPk(id);
    if (!bill) {
      return res.status(404).json({ message: 'Deleted bill not found' });
    }
    await bill.destroy();
    res.json({ message: 'Deleted bill removed successfully' });
  } catch (err) {
    console.error('Error deleting deleted bill:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};
