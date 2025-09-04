const express = require("express");
const router = express.Router();
const pcController = require("../controllers/primaryCareController");
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// CRUD routes
router.post("/", authMiddleware, roleMiddleware(['admin']), pcController.createPrimaryCare);        // Create
router.get("/", authMiddleware, roleMiddleware(['admin', 'receptionist']), pcController.getAllPrimaryCare);         // Read all
router.get("/:id", authMiddleware, roleMiddleware(['admin', 'receptionist']), pcController.getPrimaryCareById);     // Read one
router.put("/:id", authMiddleware, roleMiddleware(['admin']), pcController.updatePrimaryCare);      // Update
router.delete("/:id", authMiddleware, roleMiddleware(['admin']), pcController.deletePrimaryCare);   // Delete (soft)

module.exports = router;
