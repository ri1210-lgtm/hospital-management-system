const Patient = require('../models/Patient');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const { validationResult } = require('express-validator');

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      emergencyContact,
      bloodType,
      allergies,
      medicalHistory,
    } = req.body;

    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;
    const hospitalId = req.user.hospital;
    const userId = req.user.id;

    // Check if patient with same phone already exists in this hospital
    const existingPatient = await Patient.findOne({ phone, tenantId });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient with this phone number already exists in this hospital' });
    }

    // Create patient
    const patient = new Patient({
      name,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      emergencyContact,
      bloodType,
      allergies,
      medicalHistory,
      hospital: hospitalId,
      tenantId,
      createdBy: userId,
    });

    await patient.save();

    res.status(201).json({
      message: 'Patient registered successfully',
      patient: {
        id: patient._id,
        name: patient.name,
        phone: patient.phone,
        gender: patient.gender,
        createdAt: patient.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all patients (within the same hospital)
exports.getAllPatients = async (req, res) => {
  try {
    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const patients = await Patient.find({ tenantId })
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search patients by name or phone
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    
    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const patients = await Patient.find({
      tenantId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ],
    })
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const patient = await Patient.findOne({ _id: req.params.id, tenantId })
      .select('-__v')
      .populate('createdBy', 'name');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const {
      name,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      emergencyContact,
      bloodType,
      allergies,
      medicalHistory,
    } = req.body;

    const patient = await Patient.findOne({ _id: req.params.id, tenantId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if phone is being changed and if it already exists
    if (phone && phone !== patient.phone) {
      const existingPatient = await Patient.findOne({ phone, tenantId });
      if (existingPatient) {
        return res.status(400).json({ message: 'Patient with this phone number already exists in this hospital' });
      }
      patient.phone = phone;
    }

    patient.name = name || patient.name;
    patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
    patient.gender = gender || patient.gender;
    patient.email = email || patient.email;
    patient.address = address || patient.address;
    patient.emergencyContact = emergencyContact || patient.emergencyContact;
    patient.bloodType = bloodType || patient.bloodType;
    patient.allergies = allergies || patient.allergies;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;

    await patient.save();

    res.json({
      message: 'Patient updated successfully',
      patient,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};