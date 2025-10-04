const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController'); 
const auth = require('../middleware/auth');

// Define the signup route
router.post('/signup', signup);

// Define the login route
router.post('/login', login);

router.get('/me', auth, getMe); 

module.exports = router;