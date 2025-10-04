const User = require('../models/User');

// @desc    Admin gets a count of all employees and managers in their company
exports.getAdminSummary = async (req, res) => {
    try {
        const employeeCount = await User.countDocuments({ company: req.user.company, role: 'Employee' });
        const managerCount = await User.countDocuments({ company: req.user.company, role: 'Manager' });
        res.json({ employeeCount, managerCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Manager gets a count of employees who report to them
exports.getManagerSummary = async (req, res) => {
    try {
        const subordinateCount = await User.countDocuments({ manager: req.user.id });
        res.json({ subordinateCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};