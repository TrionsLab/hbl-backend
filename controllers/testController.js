// controllers/testController.js
const Test = require("../models/Test"); // make sure this model exists
const { success, error } = require("../utils/helpers/responseHelper");

// ✅ Create a new test
exports.createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    return success(
      res,
      { insertId: test.id },
      "Test created successfully"
    );
  } catch (err) {
    console.error("Error creating test:", err);
    return error(res, err, 500, "DB Error");
  }
};

// ✅ Get all tests
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.findAll({
      order: [["createdAt", "DESC"]],
    });
    return success(res, tests, "Tests fetched successfully");
  } catch (err) {
    console.error("Error fetching tests:", err);
    return error(res, err, 500, "DB Error");
  }
};

// ✅ Update a test
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findByPk(id);

    if (!test) {
      return error(res, "Test not found", 404);
    }

    const updatedTest = await test.update(req.body);
    return success(
      res,
      updatedTest,
      "Test updated successfully"
    );
  } catch (err) {
    console.error("Error updating test:", err);
    return error(res, err, 500, "DB Error");
  }
};

// ✅ Delete a test
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findByPk(id);

    if (!test) {
      return error(res, "Test not found", 404);
    }

    await test.destroy({ force: true });
    return success(res, null, "Test deleted successfully");
  } catch (err) {
    console.error("Error deleting test:", err);
    return error(res, err, 500, "DB Error");
  }
};
