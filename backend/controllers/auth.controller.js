const User = require('../models/User');
const Hospital = require('../models/Hospital');
const jwtUtils = require('../utils/jwt.utils');
const { validationResult } = require('express-validator');

// Register a new hospital
exports.registerHospital = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address, password } = req.body;

    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({ message: 'Hospital with this email already exists' });
    }

    // Generate tenantId
    const tenantId = `tenant_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // Create hospital
    const hospital = new Hospital({
      name,
      email,
      phone,
      address,
      tenantId,
    });

    await hospital.save();

    // Create admin user for the hospital
    const adminUser = new User({
      name: `${name} Admin`,
      email: `admin@${email.split('@')[1]}`,
      password,
      role: 'admin',
      hospital: hospital._id,
      tenantId,
    });

    await adminUser.save();

    // Generate token
    const token = jwtUtils.generateToken({
      id: adminUser._id,
      role: adminUser.role,
      tenantId: adminUser.tenantId,
      hospital: hospital._id,
    });

    res.status(201).json({
      message: 'Hospital registered successfully',
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        tenantId: adminUser.tenantId,
      },
      hospital: {
        id: hospital._id,
        name: hospital.name,
        tenantId: hospital.tenantId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).populate('hospital');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwtUtils.generateToken({
      id: user._id,
      role: user.role,
      tenantId: user.tenantId,
      hospital: user.hospital._id,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
      hospital: {
        id: user.hospital._id,
        name: user.hospital.name,
        tenantId: user.tenantId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};