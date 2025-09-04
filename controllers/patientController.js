// controllers/patientController.js
const Patient = require("../models/Patient");
const { success, error } = require("../utils/helpers/responseHelper");

// ✅ Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      order: [["created_at", "DESC"]],
    });
    return success(res, patients, "Patients fetched successfully");
  } catch (err) {
    console.error("Error fetching patients:", err);
    return error(res, err, 500, "Failed to fetch patients");
  }
};

// ✅ Create a new patient
const addPatient = async (req, res) => {
  try {
    const { name, age, ageMonths, gender, phone } = req.body;

    if (!name) {
      return error(res, "Name is required", 400);
    }

    const newPatient = await Patient.create({
      name,
      age,
      ageMonths,
      gender,
      phone,
    });

    return success(res, newPatient, "Patient created successfully");
  } catch (err) {
    console.error("Error creating patient:", err);
    return error(res, err, 500, "Failed to create patient");
  }
};

module.exports = {
  getAllPatients,
  addPatient,
};
