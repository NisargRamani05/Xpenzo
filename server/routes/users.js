const express = require('express');
const router = express.Router();

// --- THIS IS THE ONLY IMPORT LINE YOU NEED FROM THE CONTROLLER ---
const { 
    createUser, 
    getManagers, 
    getAdminDirectory, 
    getManagerTeam 
} = require('../controllers/userController');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/users
// @desc    Admin creates a user
router.post('/', [auth, admin], createUser);

// @route   GET /api/users/managers
// @desc    Admin gets all managers in their company
router.get('/managers', [auth, admin], getManagers);

// @route   GET /api/users/directory
// @desc    Admin gets the full company directory
router.get('/directory', [auth, admin], getAdminDirectory);

// @route   GET /api/users/team
// @desc    Manager gets their team list
router.get('/team', auth, getManagerTeam);

module.exports = router;