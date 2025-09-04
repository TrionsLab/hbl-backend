const express = require("express");
const router = express.Router();
const receptionController = require("../controllers/receptionController");
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get("/", authMiddleware, roleMiddleware(["admin"]), receptionController.getReceptions);
router.post("/", authMiddleware, roleMiddleware(["admin"]), receptionController.createReception);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), receptionController.updateReception);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), receptionController.deleteReception);

module.exports = router;