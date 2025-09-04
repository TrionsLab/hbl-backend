const PrimaryCare = require("../models/PrimaryCare");
const { success, error } = require("../utils/helpers/responseHelper");

// Create new PrimaryCare
exports.createPrimaryCare = async (req, res) => {
  try {
    const pc = await PrimaryCare.create(req.body);
    return success(res, pc, "Primary care entry created");
  } catch (err) {
    return error(res, err);
  }
};

// Get all PrimaryCare entries
exports.getAllPrimaryCare = async (req, res) => {
  try {
    const pcs = await PrimaryCare.findAll({ order: [["created_at", "DESC"]] });
    return success(res, pcs);
  } catch (err) {
    return error(res, err);
  }
};

// Get single PrimaryCare by ID
exports.getPrimaryCareById = async (req, res) => {
  try {
    const pc = await PrimaryCare.findByPk(req.params.id);
    if (!pc) return error(res, "Primary care entry not found", 404);
    return success(res, pc);
  } catch (err) {
    return error(res, err);
  }
};

// Update PrimaryCare
exports.updatePrimaryCare = async (req, res) => {
  try {
    const pc = await PrimaryCare.findByPk(req.params.id);
    if (!pc) return error(res, "Primary care entry not found", 404);

    await pc.update(req.body);
    return success(res, pc, "Primary care entry updated");
  } catch (err) {
    return error(res, err);
  }
};

// Delete PrimaryCare
exports.deletePrimaryCare = async (req, res) => {
  try {
    const pc = await PrimaryCare.findByPk(req.params.id);
    if (!pc) return error(res, "Primary care entry not found", 404);

    await pc.destroy();
    return success(res, null, "Primary care entry deleted (soft delete)");
  } catch (err) {
    return error(res, err);
  }
};
