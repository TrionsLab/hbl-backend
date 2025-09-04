const express = require("express");

const authRoutes = require("./routes/authRoutes");
const billRoutes = require("./routes/billRoutes");
// const referencesRoutes = require("./routes/referenceRoutes");
const receptionRoutes = require("./routes/receptionRoutes");
const testRoutes = require("./routes/testRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const primaryCareRoutes = require("./routes/primaryCareRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/bills", billRoutes);
// router.use("/pc-doc-ref", referencesRoutes);
router.use("/receptions", receptionRoutes);
router.use("/tests", testRoutes);
router.use("/patient", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/primary-care", primaryCareRoutes);

module.exports = router;