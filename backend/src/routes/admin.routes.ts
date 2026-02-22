import { Router } from 'express';
import { body } from 'express-validator';
import {
  getDashboardStats,
  getUsers,
  toggleUserBan,
  getAdminListings,
  toggleFeatured,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getReports,
  updateReport,
} from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';
import adminOnly from '../middleware/admin.middleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// Validation rules
const categoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('icon').optional().isString(),
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
];

const reportValidation = [
  body('status')
    .isIn(['pending', 'reviewed', 'resolved', 'dismissed'])
    .withMessage('Invalid status'),
  body('adminNotes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Admin notes cannot exceed 500 characters'),
];

// Dashboard
router.get('/stats', getDashboardStats);

// Users
router.get('/users', getUsers);
router.put('/users/:id/ban', toggleUserBan);

// Listings
router.get('/listings', getAdminListings);
router.put('/listings/:id/featured', toggleFeatured);

// Categories
router.get('/categories', getCategories);
router.post('/categories', categoryValidation, createCategory);
router.put('/categories/:id', categoryValidation, updateCategory);
router.delete('/categories/:id', deleteCategory);

// Reports
router.get('/reports', getReports);
router.put('/reports/:id', reportValidation, updateReport);

export default router;
