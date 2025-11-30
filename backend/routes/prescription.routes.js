const express = require('express');
const { body } = require('express-validator');
const prescriptionController = require('../controllers/prescription.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const createPrescriptionValidation = [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('diagnosis').notEmpty().withMessage('Diagnosis is required'),
  body('medications').isArray({ min: 1 }).withMessage('At least one medication is required'),
  body('medications.*.name').notEmpty().withMessage('Medication name is required'),
  body('medications.*.dosage').notEmpty().withMessage('Medication dosage is required'),
  body('medications.*.frequency').notEmpty().withMessage('Medication frequency is required'),
];

const updatePrescriptionValidation = [
  body('diagnosis').optional().notEmpty().withMessage('Diagnosis cannot be empty'),
];

// All prescription routes require authentication
router.use(authenticate);

// Create prescription (doctor only)
router.post('/', authorize('doctor'), createPrescriptionValidation, prescriptionController.createPrescription);

// Get all prescriptions
router.get('/', prescriptionController.getAllPrescriptions);

// Get prescriptions by patient ID
router.get('/patient/:patientId', prescriptionController.getPrescriptionsByPatient);

// Get prescription by ID
router.get('/:id', prescriptionController.getPrescriptionById);

// Update prescription (doctor only)
router.put('/:id', authorize('doctor'), updatePrescriptionValidation, prescriptionController.updatePrescription);

// Deactivate prescription (doctor only)
router.delete('/:id', authorize('doctor'), prescriptionController.deactivatePrescription);

module.exports = router;