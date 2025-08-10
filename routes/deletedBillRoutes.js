const express = require('express');
const router = express.Router();
const deletedBillController = require('../controllers/deletedBillController');

// Route to get all deleted bills
router.get('/', deletedBillController.getDeletedBills);
router.delete('/:id', deletedBillController.deleteDeletedBill);


module.exports = router;