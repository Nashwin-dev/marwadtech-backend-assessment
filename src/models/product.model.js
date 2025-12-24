const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    index: true // Assessment Requirement: Optimized for Search
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    index: true // Assessment Requirement: Optimized for Filtering
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
    index: true // Assessment Requirement: Optimized for Filtering
  },
  // 'created_at' timestamp is handled automatically by timestamps: true
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

module.exports = mongoose.model('Product', productSchema);