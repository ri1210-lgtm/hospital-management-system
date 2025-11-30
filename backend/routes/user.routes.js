const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const createUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['admin', 'doctor', 'receptionist']).withMessage('Role must be admin, doctor, or receptionist'),
];

const updateUserValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
];

// All user routes require authentication
router.use(authenticate);

// Create user (admin only)
router.post('/', authorize('admin'), createUserValidation, userController.createUser);

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user (admin can change role)
router.put('/:id', updateUserValidation, userController.updateUser);

// Deactivate user (admin only)
router.delete('/:id', authorize('admin'), userController.deactivateUser);

module.exports = router;