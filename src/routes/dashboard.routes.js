const express = require('express');
const { getDashboardStats } = require('../controllers/dashboard.controller');

const router = express.Router();

// Route: GET /api/dashboard
router.get('/', getDashboardStats);

module.exports = router;