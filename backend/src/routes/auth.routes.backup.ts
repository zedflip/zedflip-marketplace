import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  updatePassword,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .matches(/^\+260[0-9]{9}$/)
    .withMessage('Please enter a valid Zambian phone number (+260XXXXXXXXX)'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('city')
    .isIn([
      'Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Livingstone',
      'Chipata', 'Mansa', 'Mongu', 'Solwezi', 'Kasama',
      'Mufulira', 'Luanshya',
    ])
    .withMessage('Please select a valid Zambian city'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const passwordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/password', protect, passwordValidation, updatePassword);

export default router;
