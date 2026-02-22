import { Router } from 'express';
import { body } from 'express-validator';
import {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  markAsSold,
  getFeaturedListings,
} from '../controllers/listing.controller';
import { protect, optionalAuth } from '../middleware/auth.middleware';
import { uploadMultiple } from '../middleware/upload.middleware';

const router = Router();

// Validation rules
const listingValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('price')
    .isNumeric()
    .custom((value) => value >= 0)
    .withMessage('Price must be a positive number'),
  body('condition')
    .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
    .withMessage('Invalid condition'),
  body('category')
    .isMongoId()
    .withMessage('Invalid category'),
  body('city')
    .isIn([
      'Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Livingstone',
      'Chipata', 'Mansa', 'Mongu', 'Solwezi', 'Kasama',
      'Mufulira', 'Luanshya',
    ])
    .withMessage('Please select a valid Zambian city'),
  body('contactPhone')
    .optional()
    .matches(/^\+260[0-9]{9}$/)
    .withMessage('Please enter a valid Zambian phone number'),
];

// Routes
router.get('/', optionalAuth, getListings);
router.get('/featured', getFeaturedListings);
router.get('/:id', optionalAuth, getListing);
router.post('/', protect, uploadMultiple, listingValidation, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.put('/:id/sold', protect, markAsSold);

export default router;
