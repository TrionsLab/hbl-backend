// controllers/doctorController.js
const Doctor = require("../models/Doctor");
const { success, error } = require("../utils/helpers/responseHelper");

// ✅ Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      order: [["created_at", "DESC"]],
    });
    return success(res, doctors, "Doctors fetched successfully");
  } catch (err) {
    console.error("Error fetching doctors:", err);
    return error(res, err, 500, "Failed to fetch doctors");
  }
};

// ✅ Get a doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return error(res, "Doctor not found", 404);
    }
    return success(res, doctor, "Doctor fetched successfully");
  } catch (err) {
    console.error("Error fetching doctor:", err);
    return error(res, err, 500, "Failed to fetch doctor");
  }
};

// ✅ Create a new doctor
const createDoctor = async (req, res) => {
  try {
    const { name, specialization, fee } = req.body;

    if (!name) {
      return error(res, "Name is required", 400);
    }

    const newDoctor = await Doctor.create({
      name,
      specialization,
      fee,
    });

    return success(res, newDoctor, "Doctor created successfully");
  } catch (err) {
    console.error("Error creating doctor:", err);
    return error(res, err, 500, "Failed to create doctor");
  }
};

// ✅ Update doctor by ID
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, fee } = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return error(res, "Doctor not found", 404);
    }

    doctor.name = name ?? doctor.name;
    doctor.specialization = specialization ?? doctor.specialization;
    doctor.fee = fee ?? doctor.fee;

    await doctor.save();
    return success(res, doctor, "Doctor updated successfully");
  } catch (err) {
    console.error("Error updating doctor:", err);
    return error(res, err, 500, "Failed to update doctor");
  }
};

// ✅ Delete doctor by ID
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return error(res, "Doctor not found", 404);
    }

    await doctor.destroy();
    return success(res, null, "Doctor deleted successfully");
  } catch (err) {
    console.error("Error deleting doctor:", err);
    return error(res, err, 500, "Failed to delete doctor");
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
