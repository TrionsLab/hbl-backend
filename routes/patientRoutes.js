const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(["admin", "receptionist"]), patientController.addPatient);
router.get('/', authMiddleware, roleMiddleware(["admin", "receptionist"]), patientController.getAllPatients);

module.exports = router;
