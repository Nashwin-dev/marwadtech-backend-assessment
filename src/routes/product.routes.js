const express = require('express');
const { createProduct, getProducts } = require('../controllers/product.controller');

const router = express.Router();

// Route: POST /api/products (To add data)
router.post('/', createProduct);

// Route: GET /api/products (The advanced search/filter API)
router.get('/', getProducts);

module.exports = router;