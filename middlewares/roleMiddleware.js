const jwt = require("jsonwebtoken");

const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const token =
        req.cookies?.jwt ||
        req.headers["authorization"]?.split(" ")[1]; 

      // if (!token) {
      //   return res.status(401).json({ message: "No token provided" });
      // }

      // const decodedToken = jwt.verify(token, "hello123"); 
      // req.user = decodedToken; 

      // if (!allowedRoles.includes(decodedToken.role)) {
      //   return res
      //     .status(403)
      //     .json({ message: "Forbidden: insufficient rights" });
      // }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = roleMiddleware;
