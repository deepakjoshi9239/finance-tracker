// backend/routes/authRoute.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateUser } = require('../middleware/authenticate'); // Fix import to use destructuring
const Joi = require('joi');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "9bc792702f9e0f7f143f6b940fc72068f2175540cce97cb10a8a8b4a0cdcdbc5"; // Always set default

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts. Please try again later.',
});

// Validation function for user input
const validateRegisterInput = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    financialCondition: Joi.string().optional(),
  });
  return schema.validate(data);
};

// Register a User
router.post('/register', async (req, res) => {
  const { error } = validateRegisterInput(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { name, email, password, financialCondition } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, financialCondition });
    const savedUser = await newUser.save();

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});

// Login a User
router.post('/login', loginLimiter, async (req, res) => { // Add rate limiter here
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a payload with the user ID
    const payload = { userId: user._id };

    // Generate a JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Return the token to the client
    res.status(200).json({ token });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
