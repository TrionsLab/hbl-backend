const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get("/", authMiddleware, roleMiddleware(['admin', 'receptionist']), getDoctors);
router.get("/:id", authMiddleware, roleMiddleware(['admin', 'receptionist']), getDoctorById);
router.post("/", authMiddleware, roleMiddleware(['admin']), createDoctor);
router.put("/:id", authMiddleware, roleMiddleware(['admin']), updateDoctor);
router.delete("/:id", authMiddleware, roleMiddleware(['admin']), deleteDoctor);

module.exports = router;
