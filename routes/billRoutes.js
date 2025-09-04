const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['admin']), billController.getAllBills);
router.post('/', authMiddleware, roleMiddleware(['admin', 'receptionist']), billController.createBill);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), billController.deleteBill);
router.get('/archived', authMiddleware, roleMiddleware(['admin']), billController.getArchivedBills);
router.get('/stats', authMiddleware, roleMiddleware(['admin']), billController.billStats);
router.get('/referral-earnings', authMiddleware, roleMiddleware(['admin']), billController.referralEarnings);
router.put('/:id/archive', authMiddleware, roleMiddleware(['admin']), billController.archiveBill);
router.put('/:id/restore', authMiddleware, roleMiddleware(['admin']), billController.restoreBill);
router.put('/:id/clear-due', authMiddleware, roleMiddleware(['admin']), billController.clearBillDue);

module.exports = router;
