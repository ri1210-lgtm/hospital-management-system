const express = require('express');
const { body } = require('express-validator');
const hospitalController = require('../controllers/hospital.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const updateHospitalValidation = [
  body('name').optional().notEmpty().withMessage('Hospital name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().notEmpty().withMessage('Phone number is required'),
];

// All hospital routes require authentication and admin authorization
router.use(authenticate, authorize('admin'));

// Get all hospitals (super admin only)
router.get('/', hospitalController.getAllHospitals);

// Get hospital by ID
router.get('/:id', hospitalController.getHospitalById);

// Update hospital
router.put('/:id', updateHospitalValidation, hospitalController.updateHospital);

// Deactivate hospital
router.delete('/:id', hospitalController.deactivateHospital);

module.exports = router;