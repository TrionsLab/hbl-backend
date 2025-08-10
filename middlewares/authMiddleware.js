const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  } else {
    res.status(401).json({ message: 'Authorization header missing' });
  }
};

module.exports = { authenticateJWT };