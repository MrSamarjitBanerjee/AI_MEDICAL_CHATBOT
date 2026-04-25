// Authentication Controller
const { generateToken } = require('../utils/jwtUtils');                                                                                              
const User = require('../models/User');
const logger = require('../utils/logger');

// User signup
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const user = await User.create({ name: name || email.split('@')[0], email, password });

    
    const token = generateToken(user._id);

    logger.info(`New user signed up: ${user.email}`);
    res.status(201).json({ user: { id: user._id, email: user.email, name: user.name }, token });
  } catch (error) {
    logger.error(`Signup error for ${req.body.email}: ${error.message}`);
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const token = generateToken(user._id);

    logger.info(`User logged in: ${user.email}`);
    res.status(200).json({ userId: user._id, token, email: user.email });
  } catch (error) {
    logger.error(`Login error for ${req.body.email}: ${error.message}`);
    next(error);
  }
};

module.exports = { signup, login };

