const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.post('/login', authController.login);
router.post('/register', roleMiddleware(["admin"]), authController.register); // will be substituted by admin creation / or update the routes
router.post('/logout', authController.logout);


module.exports = router;