const User = require('../models/user.model');
const Product = require('../models/product.model');

// Helper to calculate date ranges
const getDateRange = (filter, customStart, customEnd) => {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));

  switch (filter) {
    case 'today':
      return { start: todayStart, end: todayEnd };
    
    case 'yesterday': {
      const start = new Date(todayStart);
      start.setDate(start.getDate() - 1);
      const end = new Date(todayEnd);
      end.setDate(end.getDate() - 1);
      return { start, end };
    }

    case 'weekly': {
      // Last 7 days
      const start = new Date(todayStart);
      start.setDate(start.getDate() - 7);
      return { start, end: todayEnd };
    }

    case 'monthly': {
      // Last 30 days
      const start = new Date(todayStart);
      start.setDate(start.getDate() - 30);
      return { start, end: todayEnd };
    }

    case 'custom':
      return { 
        start: customStart ? new Date(customStart) : new Date(0), // Default to beginning of time
        end: customEnd ? new Date(customEnd) : new Date() 
      };

    default:
      return {}; // No filter, return all time
  }
};

// @desc    Get Dashboard Stats
// @route   GET /api/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const { filter, startDate, endDate } = req.query;
    
    // 1. Get Date Range Objects
    const dateQuery = {};
    const range = getDateRange(filter, startDate, endDate);

    if (range.start || range.end) {
        dateQuery.created_at = {}; // Matches the 'created_at' field in our models
        if (range.start) dateQuery.created_at.$gte = range.start;
        if (range.end) dateQuery.created_at.$lte = range.end;
        
        // Note: User model uses default 'createdAt', Product uses 'created_at'.
        // We handle this below.
    }

    // 2. Execute Queries in Parallel (Faster)
    // For Users (Schema uses 'createdAt')
    const userQuery = range.start ? { 
        createdAt: { $gte: range.start, $lte: range.end } 
    } : {};

    // For Products (Schema uses 'created_at')
    const productQuery = range.start ? { 
        created_at: { $gte: range.start, $lte: range.end } 
    } : {};

    const [totalUsers, totalProducts] = await Promise.all([
      User.countDocuments(userQuery),
      Product.countDocuments(productQuery)
    ]);

    // 3. Dummy Data for Orders/Revenue (As per assessment instructions)
    // In a real app, you would query the Order model here.
    const dummyStats = {
      totalOrders: Math.floor(Math.random() * 100), // Random dummy number
      totalRevenue: Math.floor(Math.random() * 50000)
    };

    res.status(200).json({
      success: true,
      filter: filter || 'all',
      data: {
        totalUsers,
        totalProducts,
        ...dummyStats
      }
    });

  } catch (error) {
    next(error);
  }
};