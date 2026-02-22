import { Request, Response } from 'express';
import User from '../models/User';
import Listing from '../models/Listing';
import Review from '../models/Review';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadImage } from '../config/cloudinary';

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select(
      '-email -phone -isAdmin -isBanned'
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Get user's active listings
    const listings = await Listing.find({
      seller: user._id,
      status: 'active',
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('category', 'name slug');

    // Get user's reviews
    const reviews = await Review.find({ reviewee: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('reviewer', 'name avatar');

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          city: user.city,
          avatar: user.avatar,
          bio: user.bio,
          isVerified: user.isVerified,
          rating: user.rating,
          totalReviews: user.totalReviews,
          totalListings: user.totalListings,
          totalSales: user.totalSales,
          lastActive: user.lastActive,
          createdAt: user.createdAt,
        },
        listings,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, city, bio, phone } = req.body;

    const user = await User.findById(req.user!._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        res.status(400).json({
          success: false,
          message: 'Phone number already in use',
        });
        return;
      }
    }

    // Update fields
    if (name) user.name = name;
    if (city) user.city = city;
    if (bio !== undefined) user.bio = bio;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
export const updateAvatar = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
      return;
    }

    // Convert buffer to base64
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const imageUrl = await uploadImage(base64);

    // Update user avatar
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { avatar: imageUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatar: user!.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update avatar',
    });
  }
};

// @desc    Get user's listings
// @route   GET /api/users/:id/listings
// @access  Public
export const getUserListings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string || 'active';

    const query: any = { seller: req.params.id };
    if (status !== 'all') {
      query.status = status;
    }

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      data: {
        listings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user listings',
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/users/:id/reviews
// @access  Public
export const getUserReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const total = await Review.countDocuments({ reviewee: req.params.id });
    const reviews = await Review.find({ reviewee: req.params.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('reviewer', 'name avatar')
      .populate('listing', 'title images');

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user reviews',
    });
  }
};

export default {
  getUserProfile,
  updateProfile,
  updateAvatar,
  getUserListings,
  getUserReviews,
};
