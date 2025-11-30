const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('name').notEmpty().withMessage('Hospital name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Register a new hospital
router.post('/register', registerValidation, authController.registerHospital);

// User login
router.post('/login', loginValidation, authController.login);

module.exports = router;