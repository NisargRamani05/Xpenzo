const express = require('express');
const router = express.Router();
const { getAdminSummary, getManagerSummary } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
// You can also create a 'manager' middleware similar to the 'admin' one if you want extra security

// @route   GET /api/analytics/admin
router.get('/admin', [auth, admin], getAdminSummary);

// @route   GET /api/analytics/manager
router.get('/manager', auth, getManagerSummary);

module.exports = router;