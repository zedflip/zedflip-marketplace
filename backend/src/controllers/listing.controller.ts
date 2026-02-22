import { Request, Response } from 'express';
import Listing from '../models/Listing';
import Category from '../models/Category';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadMultipleImages } from '../config/cloudinary';

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
export const getListings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const sort = (req.query.sort as string) || '-createdAt';

    // Build query
    const query: any = { status: 'active' };

    // Category filter
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        query.category = category._id;
      }
    }

    // City filter
    if (req.query.city) {
      query.city = req.query.city;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseInt(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseInt(req.query.maxPrice as string);
      }
    }

    // Condition filter
    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    // Search query
    if (req.query.q) {
      query.$text = { $search: req.query.q as string };
    }

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'name slug icon')
      .populate('seller', 'name avatar city rating');

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
      message: 'Failed to get listings',
    });
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
export const getListing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('category', 'name slug icon')
      .populate('seller', 'name avatar city rating totalReviews phone createdAt');

    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
      return;
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    // Get related listings
    const relatedListings = await Listing.find({
      _id: { $ne: listing._id },
      category: listing.category,
      status: 'active',
    })
      .limit(4)
      .populate('category', 'name slug')
      .populate('seller', 'name avatar');

    res.status(200).json({
      success: true,
      data: {
        listing,
        relatedListings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get listing',
    });
  }
};

// @desc    Create listing
// @route   POST /api/listings
// @access  Private
export const createListing = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      price,
      condition,
      category,
      city,
      location,
      isNegotiable,
      contactPhone,
      contactWhatsApp,
      tags,
    } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(400).json({
        success: false,
        message: 'Invalid category',
      });
      return;
    }

    // Handle image uploads
    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      const base64Images = (req.files as Express.Multer.File[]).map(
        (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      );
      imageUrls = await uploadMultipleImages(base64Images);
    }

    if (imageUrls.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one image is required',
      });
      return;
    }

    // Create listing
    const listing = await Listing.create({
      title,
      description,
      price,
      condition,
      category,
      seller: req.user!._id,
      images: imageUrls,
      city,
      location,
      isNegotiable: isNegotiable !== false,
      contactPhone: contactPhone || req.user!.phone,
      contactWhatsApp,
      tags: tags || [],
    });

    // Update user's listing count
    await User.findByIdAndUpdate(req.user!._id, {
      $inc: { totalListings: 1 },
    });

    // Update category listing count
    await Category.findByIdAndUpdate(category, {
      $inc: { listingCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create listing',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
export const updateListing = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
      return;
    }

    // Check ownership
    if (listing.seller.toString() !== req.user!._id.toString() && !req.user!.isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing',
      });
      return;
    }

    const allowedUpdates = [
      'title',
      'description',
      'price',
      'condition',
      'city',
      'location',
      'isNegotiable',
      'contactPhone',
      'contactWhatsApp',
      'tags',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        (listing as any)[field] = req.body[field];
      }
    });

    await listing.save();

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      data: listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
    });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
export const deleteListing = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
      return;
    }

    // Check ownership
    if (listing.seller.toString() !== req.user!._id.toString() && !req.user!.isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing',
      });
      return;
    }

    // Soft delete
    listing.status = 'deleted';
    await listing.save();

    // Update category listing count
    await Category.findByIdAndUpdate(listing.category, {
      $inc: { listingCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete listing',
    });
  }
};

// @desc    Mark listing as sold
// @route   PUT /api/listings/:id/sold
// @access  Private
export const markAsSold = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
      return;
    }

    // Check ownership
    if (listing.seller.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    listing.status = 'sold';
    listing.soldAt = new Date();
    await listing.save();

    // Update user's sales count
    await User.findByIdAndUpdate(req.user!._id, {
      $inc: { totalSales: 1 },
    });

    res.status(200).json({
      success: true,
      message: 'Listing marked as sold',
      data: listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
    });
  }
};

// @desc    Get featured listings
// @route   GET /api/listings/featured
// @access  Public
export const getFeaturedListings = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const listings = await Listing.find({
      status: 'active',
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('category', 'name slug icon')
      .populate('seller', 'name avatar');

    res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get featured listings',
    });
  }
};

export default {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  markAsSold,
  getFeaturedListings,
};
