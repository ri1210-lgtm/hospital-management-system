const Hospital = require('../models/Hospital');
const { validationResult } = require('express-validator');

// Get all hospitals (for super admin)
exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().select('-__v');
    res.json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get hospital by ID
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).select('-__v');
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    
    res.json(hospital);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid hospital ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update hospital
exports.updateHospital = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address } = req.body;

    const hospital = await Hospital.findById(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== hospital.email) {
      const existingHospital = await Hospital.findOne({ email });
      if (existingHospital) {
        return res.status(400).json({ message: 'Hospital with this email already exists' });
      }
      hospital.email = email;
    }

    hospital.name = name || hospital.name;
    hospital.phone = phone || hospital.phone;
    hospital.address = address || hospital.address;

    await hospital.save();

    res.json({
      message: 'Hospital updated successfully',
      hospital: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        phone: hospital.phone,
        address: hospital.address,
        tenantId: hospital.tenantId,
        isActive: hospital.isActive,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid hospital ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Deactivate hospital
exports.deactivateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    hospital.isActive = false;
    await hospital.save();

    res.json({ message: 'Hospital deactivated successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid hospital ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};