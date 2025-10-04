const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// @desc    Admin creates a new user (Employee or Manager)
exports.createUser = async (req, res) => {
  const { name, email, password, role, manager } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({
      name, email, password, role,
      company: req.user.company, // Assign to the admin's company
      manager: role === 'Employee' ? manager : null
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.getManagers = async (req, res) => {
    try {
        const managers = await User.find({ company: req.user.company, role: 'Manager' }).select('name _id');
        res.json(managers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Admin gets a full directory of managers and their employees
exports.getAdminDirectory = async (req, res) => {
    try {
        const managers = await User.find({ company: req.user.company, role: 'Manager' }).select('name email').lean();

        const directory = await Promise.all(managers.map(async (manager) => {
            const employees = await User.find({ manager: manager._id }).select('name email').lean();
            return { ...manager, employees };
        }));

        res.json(directory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Manager gets a list of their direct-report employees
exports.getManagerTeam = async (req, res) => {
    try {
        const team = await User.find({ manager: req.user.id }).select('name email');
        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};