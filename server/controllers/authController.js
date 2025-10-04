const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

exports.signup = async (req, res) => {
  const { companyName, name, email, password } = req.body;

  try {
    // 1. Check if company name already exists
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({ msg: 'A company with this name already exists.' });
    }

    // 2. Check if user email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists.' });
    }

    // 3. Create the new Company
    const newCompany = new Company({ name: companyName });
    await newCompany.save();

    // 4. Create the new Admin user
    user = new User({
      name,
      email,
      password,
      company: newCompany._id,
      role: 'Admin' 
    });

    // 5. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // 6. Create and return a JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        company: user.company
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                company: user.company
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET /api/auth/me
// @desc    Get current user's profile
// @access  Private
exports.getMe = async (req, res) => {
    try {
        // Find user by ID from the token, populate company and manager details
        const user = await User.findById(req.user.id)
            .select('-password') // Exclude the password for security
            .populate('company', 'name defaultCurrency') // Get company name and currency
            .populate('manager', 'name'); // Get manager's name

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};