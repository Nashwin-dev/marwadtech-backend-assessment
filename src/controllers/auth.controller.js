const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token valid for 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { fullName, mobileNumber, password } = req.body;

    // 1. Validation: Check if all fields are present
    if (!fullName || !mobileNumber || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // 2. Security: Check if user already exists
    const userExists = await User.findOne({ mobileNumber });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Create User (Password hashing happens in the Model pre-save middleware)
    const user = await User.create({
      fullName,
      mobileNumber,
      password,
    });

    // 4. Respond
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        token: generateToken(user._id), // Return JWT immediately
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // Check for Mongoose Validation Errors (like the regex for mobile)
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { mobileNumber, password } = req.body;

    // 1. Validation
    if (!mobileNumber || !password) {
      return res.status(400).json({ message: 'Please provide mobile and password' });
    }

    // 2. Find user (Explicitly select password because we set select:false in model)
    const user = await User.findOne({ mobileNumber }).select('+password');

    // 3. Check password
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid mobile number or password' });
    }
  } catch (error) {
    next(error);
  }
};