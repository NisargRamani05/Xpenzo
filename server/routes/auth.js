const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// Define the signup route
router.post('/signup', signup);

// Define the login route
router.post('/login', login);

module.exports = router;