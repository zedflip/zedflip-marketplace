import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import connectDB from './config/database';
import configureCloudinary from './config/cloudinary';
import { initializeSocket } from './config/socket';
import { errorHandler, notFound } from './middleware/error.middleware';
import { logger } from './utils/logger';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import listingRoutes from './routes/listing.routes';
import chatRoutes from './routes/chat.routes';
import adminRoutes from './routes/admin.routes';
import sitemapRoutes from './routes/sitemap.routes';

// Initialize express app
const app = express();
const server = createServer(app);

// Connect to database
connectDB();

// Configure Cloudinary
configureCloudinary();

// Initialize Socket.io
initializeSocket(server);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.request(req.method, req.url, res.statusCode, duration);
  });
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', sitemapRoutes);

// Public categories route (for frontend)
app.get('/api/categories', async (_req, res) => {
  try {
    const Category = (await import('./models/Category')).default;
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
    });
  }
});

// Zambia data endpoint
app.get('/api/zambia', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      cities: [
        'Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Livingstone',
        'Chipata', 'Mansa', 'Mongu', 'Solwezi', 'Kasama',
        'Mufulira', 'Luanshya',
      ],
      currency: {
        code: 'ZMW',
        symbol: 'K',
        format: (amount: number) => `K ${amount.toLocaleString()}`,
      },
      phonePrefix: '+260',
      paymentMethods: [
        { id: 'cash', name: 'Cash on Delivery', icon: 'banknote' },
        { id: 'mobile_money', name: 'Mobile Money (MTN/Airtel)', icon: 'smartphone' },
        { id: 'bank_transfer', name: 'Bank Transfer', icon: 'building' },
      ],
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

export default app;
