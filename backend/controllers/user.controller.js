const User = require('../models/User');
const Hospital = require('../models/Hospital');
const { validationResult } = require('express-validator');

// Create a new user (staff member)
exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    
    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;
    const hospitalId = req.user.hospital;

    // Check if user already exists
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists in this hospital' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role,
      hospital: hospitalId,
      tenantId,
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (within the same hospital)
exports.getAllUsers = async (req, res) => {
  try {
    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const users = await User.find({ tenantId })
      .select('-password -__v')
      .populate('hospital', 'name');

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const user = await User.findOne({ _id: req.params.id, tenantId })
      .select('-password -__v')
      .populate('hospital', 'name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const { name, email, role } = req.body;

    const user = await User.findOne({ _id: req.params.id, tenantId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, tenantId });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists in this hospital' });
      }
      user.email = email;
    }

    user.name = name || user.name;
    // Only admin can change role
    if (role && req.user.role === 'admin') {
      user.role = role;
    }

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Deactivate user
exports.deactivateUser = async (req, res) => {
  try {
    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const user = await User.findOne({ _id: req.params.id, tenantId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};