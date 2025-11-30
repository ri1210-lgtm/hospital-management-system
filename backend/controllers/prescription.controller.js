const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Create a new prescription
exports.createPrescription = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      patientId,
      diagnosis,
      medications,
      tests,
      followUpDate,
      notes,
    } = req.body;

    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;
    const hospitalId = req.user.hospital;
    const doctorId = req.user.id;

    // Verify patient exists and belongs to the same hospital
    const patient = await Patient.findOne({ _id: patientId, tenantId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create prescription
    const prescription = new Prescription({
      patient: patientId,
      doctor: doctorId,
      hospital: hospitalId,
      tenantId,
      diagnosis,
      medications,
      tests,
      followUpDate,
      notes,
    });

    await prescription.save();

    // Populate related fields
    await prescription.populate([
      { path: 'patient', select: 'name' },
      { path: 'doctor', select: 'name' },
    ]);

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all prescriptions (within the same hospital)
exports.getAllPrescriptions = async (req, res) => {
  try {
    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const prescriptions = await Prescription.find({ tenantId })
      .select('-__v')
      .populate([
        { path: 'patient', select: 'name' },
        { path: 'doctor', select: 'name' },
      ])
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get prescriptions by patient ID
exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const prescriptions = await Prescription.find({
      patient: req.params.patientId,
      tenantId,
    })
      .select('-__v')
      .populate([
        { path: 'patient', select: 'name' },
        { path: 'doctor', select: 'name' },
      ])
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const prescription = await Prescription.findOne({
      _id: req.params.id,
      tenantId,
    })
      .select('-__v')
      .populate([
        { path: 'patient', select: 'name' },
        { path: 'doctor', select: 'name' },
      ]);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid prescription ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update prescription
exports.updatePrescription = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const {
      diagnosis,
      medications,
      tests,
      followUpDate,
      notes,
    } = req.body;

    const prescription = await Prescription.findOne({
      _id: req.params.id,
      tenantId,
    });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    prescription.diagnosis = diagnosis || prescription.diagnosis;
    prescription.medications = medications || prescription.medications;
    prescription.tests = tests || prescription.tests;
    prescription.followUpDate = followUpDate || prescription.followUpDate;
    prescription.notes = notes || prescription.notes;

    await prescription.save();

    // Populate related fields
    await prescription.populate([
      { path: 'patient', select: 'name' },
      { path: 'doctor', select: 'name' },
    ]);

    res.json({
      message: 'Prescription updated successfully',
      prescription,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid prescription ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Deactivate prescription
exports.deactivatePrescription = async (req, res) => {
  try {
    // Get tenantId from authenticated user
    const tenantId = req.user.tenantId;

    const prescription = await Prescription.findOne({
      _id: req.params.id,
      tenantId,
    });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    prescription.isActive = false;
    await prescription.save();

    res.json({ message: 'Prescription deactivated successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid prescription ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};