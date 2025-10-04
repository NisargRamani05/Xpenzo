const express = require('express');
const router = express.Router();
const { createUser, getManagers } = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/users
// @desc    Admin creates a user
// @access  Private (Admin only)
router.post('/', [auth, admin], createUser);

// @route   GET /api/users/managers
// @desc    Admin gets all managers in their company
// @access  Private (Admin only)
router.get('/managers', [auth, admin], getManagers);

module.exports = router;