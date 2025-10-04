const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/users
// @desc    Admin create a user
// @access  Private (Admin only)
router.post('/', [auth, admin], createUser);

module.exports = router;