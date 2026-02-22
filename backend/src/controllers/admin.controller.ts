import { Request, Response } from 'express';
import User from '../models/User';
import Listing from '../models/Listing';
import Category from '../models/Category';
import Report from '../models/Report';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const [totalUsers, totalListings, activeListings, totalReports] =
      await Promise.all([
        User.countDocuments(),
        Listing.countDocuments(),
        Listing.countDocuments({ status: 'active' }),
        Report.countDocuments({ status: 'pending' }),
      ]);

    // Get recent stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [newUsers, newListings, soldListings] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Listing.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Listing.countDocuments({
        status: 'sold',
        soldAt: { $gte: thirtyDaysAgo },
      }),
    ]);

    // Get listings by city
    const listingsByCity = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get listings by category
    const listingsByCategory = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          name: '$category.name',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalListings,
          activeListings,
          pendingReports: totalReports,
        },
        recent: {
          newUsers,
          newListings,
          soldListings,
        },
        listingsByCity,
        listingsByCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats',
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password');

    res.status(200).json({
      success: true,
      data: {
        users,
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
      message: 'Failed to get users',
    });
  }
};

// @desc    Ban/Unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Admin
export const toggleUserBan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Can't ban admins
    if (user.isAdmin) {
      res.status(400).json({
        success: false,
        message: 'Cannot ban admin users',
      });
      return;
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBanned ? 'User banned' : 'User unbanned',
      data: { isBanned: user.isBanned },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
    });
  }
};

// @desc    Get all listings (admin)
// @route   GET /api/admin/listings
// @access  Admin
export const getAdminListings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$text = { $search: search };
    }

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'name')
      .populate('seller', 'name email');

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

// @desc    Toggle listing featured status
// @route   PUT /api/admin/listings/:id/featured
// @access  Admin
export const toggleFeatured = async (
  req: Request,
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

    listing.isFeatured = !listing.isFeatured;
    await listing.save();

    res.status(200).json({
      success: true,
      message: listing.isFeatured
        ? 'Listing marked as featured'
        : 'Listing removed from featured',
      data: { isFeatured: listing.isFeatured },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
    });
  }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Admin
export const getCategories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find().sort({ order: 1 });

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
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Admin
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, icon, description, parent } = req.body;

    const category = await Category.create({
      name,
      icon,
      description,
      parent: parent || null,
    });

    res.status(201).json({
      success: true,
      message: 'Category created',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Admin
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, icon, description, isActive, order } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, icon, description, isActive, order },
      { new: true, runValidators: true }
    );

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category updated',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Admin
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if category has listings
    const listingCount = await Listing.countDocuments({
      category: req.params.id,
    });

    if (listingCount > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category with ${listingCount} listings`,
      });
      return;
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
    });
  }
};

// @desc    Get reports
// @route   GET /api/admin/reports
// @access  Admin
export const getReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = (req.query.status as string) || 'pending';

    const query: any = {};
    if (status !== 'all') {
      query.status = status;
    }

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('reporter', 'name email')
      .populate('targetUser', 'name email')
      .populate('targetListing', 'title');

    res.status(200).json({
      success: true,
      data: {
        reports,
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
      message: 'Failed to get reports',
    });
  }
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id
// @access  Admin
export const updateReport = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, adminNotes } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      res.status(404).json({
        success: false,
        message: 'Report not found',
      });
      return;
    }

    report.status = status;
    report.adminNotes = adminNotes;
    if (status === 'resolved' || status === 'dismissed') {
      report.resolvedBy = req.user!._id;
      report.resolvedAt = new Date();
    }
    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report updated',
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update report',
    });
  }
};

export default {
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
};
