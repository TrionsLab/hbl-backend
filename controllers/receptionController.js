const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { success, error } = require("../utils/helpers/responseHelper");

// 📍 Get all receptions
exports.getReceptions = (req, res) => {
  db.query(
    "SELECT id, username, email, role FROM users WHERE role = 'reception'",
    (err, results) => {
      if (err) return error(res, err, 500, "DB error");
      return success(res, results, "Receptions fetched successfully");
    }
  );
};

// 📍 Create a new reception
exports.createReception = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return error(res, "Username, email and password are required", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'reception')",
      [username, email, hashedPassword],
      (err, result) => {
        if (err) return error(res, err, 500, "DB error");
        return success(
          res,
          { id: result.insertId },
          "Reception created successfully"
        );
      }
    );
  } catch (err) {
    return error(res, err, 500, "Error creating reception");
  }
};

// 📍 Update reception (admin can also reset password)
exports.updateReception = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ? AND role = 'reception'",
        [username, email, hashedPassword, id],
        (err, result) => {
          if (err) return error(res, err, 500, "DB error");
          if (result.affectedRows === 0)
            return error(res, "Reception not found", 404);
          return success(res, null, "Reception updated successfully");
        }
      );
    } else {
      db.query(
        "UPDATE users SET username = ?, email = ? WHERE id = ? AND role = 'reception'",
        [username, email, id],
        (err, result) => {
          if (err) return error(res, err, 500, "DB error");
          if (result.affectedRows === 0)
            return error(res, "Reception not found", 404);
          return success(res, null, "Reception updated successfully");
        }
      );
    }
  } catch (err) {
    return error(res, err, 500, "Error updating reception");
  }
};

// 📍 Delete reception
exports.deleteReception = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM users WHERE id = ? AND role = 'reception'",
    [id],
    (err, result) => {
      if (err) return error(res, err, 500, "DB error");
      if (result.affectedRows === 0)
        return error(res, "Reception not found", 404);
      return success(res, null, "Reception deleted successfully");
    }
  );
};
