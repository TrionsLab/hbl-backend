const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { success, error } = require("../utils/helpers/responseHelper");

// exports.register = async (req, res) => {
//   const { username, email, password, role } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     db.query(
//       "INSERT INTO users_v2 (username, email, password, role) VALUES (?, ?, ?, ?)",
//       [username, email, hashedPassword, role],
//       (err, result) => {
//         if (err) return error(res, err, 500, "User registration failed");
//         return success(res, { insertId: result.insertId }, "User registered successfully");
//       }
//     );
//   } catch (err) {
//     return error(res, err, 500, "User registration failed");
//   }
// };

exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with email:", email);

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return error(res, err, 500, "Login failed");
    if (results.length === 0) return error(res, "Invalid email or password", 401);

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return error(res, "Invalid email or password", 401);

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      "hello123",
      { expiresIn: "1d" }
    );

    return success(res, { token, user: { id: user.id, username: user.username, role: user.role } }, "Login successful");
  });
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  return success(res, null, "Logged out successfully");
};
