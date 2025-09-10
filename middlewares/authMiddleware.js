// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token =
    req.cookies?.jwt || // from cookies
    req.headers["authorization"]?.split(" ")[1]; // from Bearer token

  // if (!token) {
  //   return res.status(401).json({ message: "Access denied. No token provided." });
  // }

  try {
    // const decoded = jwt.verify(token, "hello123"); // same secret as in login
    // req.user = decoded; // store decoded payload in request
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
