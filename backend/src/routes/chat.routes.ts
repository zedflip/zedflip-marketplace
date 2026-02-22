import { Router } from 'express';
import { body } from 'express-validator';
import {
  getChats,
  getChat,
  startChat,
  sendMessage,
  getUnreadCount,
} from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All chat routes require authentication
router.use(protect);

// Validation rules
const startChatValidation = [
  body('listingId').isMongoId().withMessage('Invalid listing ID'),
  body('message')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
];

const messageValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
];

// Routes
router.get('/', getChats);
router.get('/unread', getUnreadCount);
router.get('/:id', getChat);
router.post('/', startChatValidation, startChat);
router.post('/:id/messages', messageValidation, sendMessage);

export default router;
