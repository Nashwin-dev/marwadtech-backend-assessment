const Product = require('../models/product.model');

// @desc    Create a new product
// @route   POST /api/products
// @access  Public (should be Private in real app, but assessment didn't specify roles)
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (Search, Filter, Sort, Pagination)
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    // Destructure query parameters
    const { 
      page = 1, 
      limit = 10, 
      search, 
      sort, 
      status, 
      category, 
      startDate, 
      endDate 
    } = req.query;

    // 1. Build the Query Object
    const queryObj = {};

    // Filter by Status
    if (status) {
      queryObj.status = status;
    }

    // Filter by Category
    if (category) {
      queryObj.category = category;
    }

    // Search by Name (Case-insensitive regex)
    if (search) {
      queryObj.name = { $regex: search, $options: 'i' };
    }

    // Filter by Date Range (created_at)
    if (startDate || endDate) {
      queryObj.created_at = {};
      if (startDate) queryObj.created_at.$gte = new Date(startDate);
      if (endDate) queryObj.created_at.$lte = new Date(endDate);
    }

    // 2. Sorting Logic
    let sortStr = '-created_at'; // Default: Newest first
    if (sort) {
      // Map frontend params to Mongoose syntax
      // Example: 'price_asc' -> 'price', 'price_desc' -> '-price'
      const sortMap = {
        'name_asc': 'name',
        'name_desc': '-name',
        'price_asc': 'price',
        'price_desc': '-price'
      };
      sortStr = sortMap[sort] || sortStr;
    }

    // 3. Pagination Logic
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // 4. Execute Query
    const products = await Product.find(queryObj)
      .sort(sortStr)
      .skip(skip)
      .limit(limitNum);

    // Get total count for frontend pagination UI
    const total = await Product.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products
    });

  } catch (error) {
    next(error);
  }
};