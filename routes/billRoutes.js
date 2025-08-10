const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/', billController.getAllBills);
router.post('/', billController.createBill);
router.get('/stats', billController.billStats); 
router.get('/referral-earnings', billController.referralEarnings);
router.delete('/:id', billController.deleteBill);
router.put('/:id/clear-due', billController.clearBillDue);

module.exports = router;
