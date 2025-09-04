// routes/testRoutes.js
const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware(['admin', 'receptionist']), testController.getAllTests);
router.post("/", authMiddleware, roleMiddleware(["admin"]), testController.createTest);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), testController.updateTest);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), testController.deleteTest);

module.exports = router;
