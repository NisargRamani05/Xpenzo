const User = require('../models/User');
const bcrypt = require('bcryptjs');

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