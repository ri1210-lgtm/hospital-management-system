const express = require('express');
const { body } = require('express-validator');
const patientController = require('../controllers/patient.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const createPatientValidation = [
  body('name').notEmpty().withMessage('Patient name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required (YYYY-MM-DD)'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('phone').notEmpty().withMessage('Phone number is required'),
];

const updatePatientValidation = [
  body('name').optional().notEmpty().withMessage('Patient name cannot be empty'),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date of birth is required (YYYY-MM-DD)'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
];

// All patient routes require authentication
router.use(authenticate);

// Create patient (receptionist and admin only)
router.post('/', authorize('receptionist', 'admin'), createPatientValidation, patientController.createPatient);

// Get all patients
router.get('/', patientController.getAllPatients);

// Search patients
router.get('/search', patientController.searchPatients);

// Get patient by ID
router.get('/:id', patientController.getPatientById);

// Update patient (receptionist and admin only)
router.put('/:id', authorize('receptionist', 'admin'), updatePatientValidation, patientController.updatePatient);

module.exports = router;