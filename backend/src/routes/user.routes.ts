import { Router } from 'express';
import { body } from 'express-validator';
import {
  getUserProfile,
  updateProfile,
  updateAvatar,
  getUserListings,
  getUserReviews,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadAvatar } from '../middleware/upload.middleware';

const router = Router();

// Validation rules
const profileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^\+260[0-9]{9}$/)
    .withMessage('Please enter a valid Zambian phone number'),
  body('city')
    .optional()
    .isIn([
      'Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Livingstone',
      'Chipata', 'Mansa', 'Mongu', 'Solwezi', 'Kasama',
      'Mufulira', 'Luanshya',
    ])
    .withMessage('Please select a valid Zambian city'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
];

// Routes
router.get('/:id', getUserProfile);
router.get('/:id/listings', getUserListings);
router.get('/:id/reviews', getUserReviews);
router.put('/profile', protect, profileValidation, updateProfile);
router.put('/avatar', protect, uploadAvatar, updateAvatar);

export default router;
