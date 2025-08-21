const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getApplication,
  getUserApplications,
  getAllApplications
} = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateApplication } = require('../middleware/validation');

// @route   POST /api/applications
// @desc    Submit new application
// @access  Public
router.post('/', validateApplication, submitApplication);

// @route   GET /api/applications/:id
// @desc    Get single application by ID
// @access  Private
router.get('/:id', protect, getApplication);

// @route   GET /api/applications/user/:userId
// @desc    Get applications for specific user
// @access  Private
router.get('/user/:userId', protect, getUserApplications);

// @route   GET /api/applications
// @desc    Get all applications (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, getAllApplications);

module.exports = router;