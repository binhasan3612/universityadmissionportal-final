const Application = require('../models/Application');

// @desc    Submit new application
// @route   POST /api/applications
// @access  Private
const submitApplication = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      email,
      phone,
      mediumOfStudy,
      sscGPA,
      hscGPA,
      oLevelResults,
      aLevelResults,
      departmentChoice
    } = req.body;

  // For public submissions, skip applicantId and duplicate check

    // Validate medium-specific requirements
    if (mediumOfStudy === 'Bangla') {
      if (!sscGPA || !hscGPA) {
        return res.status(400).json({
          success: false,
          message: 'SSC and HSC GPA are required for Bangla medium students'
        });
      }
    } else if (mediumOfStudy === 'English') {
      if (!oLevelResults || !aLevelResults || oLevelResults.length < 5 || aLevelResults.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Minimum 5 O-Level and 2 A-Level results are required for English medium students'
        });
      }
    }

    // Create application
    const application = await Application.create({
      fullName,
      dateOfBirth,
      email,
      phone,
      mediumOfStudy,
      sscGPA: mediumOfStudy === 'Bangla' ? sscGPA : undefined,
      hscGPA: mediumOfStudy === 'Bangla' ? hscGPA : undefined,
      oLevelResults: mediumOfStudy === 'English' ? oLevelResults : undefined,
      aLevelResults: mediumOfStudy === 'English' ? aLevelResults : undefined,
      departmentChoice
    });

    // Check eligibility after save (pre-save middleware handles calculation)
    const savedApplication = await Application.findById(application._id);

    if (savedApplication.eligibilityStatus === 'Fail') {
      return res.status(400).json({
        success: false,
        message: 'Eligibility criteria not met',
        data: {
          eligibilityStatus: savedApplication.eligibilityStatus,
          eligibilityScore: savedApplication.eligibilityScore,
          requirements: mediumOfStudy === 'Bangla' 
            ? 'Both SSC and HSC GPA must be 4.0 or higher'
            : 'Minimum 20 points required from best 5 O-Levels and 2 A-Levels'
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: savedApplication
    });

  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicantId', 'fullName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns this application or is admin
    if (application.applicantId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get applications for logged-in user
// @route   GET /api/applications/user/:userId
// @access  Private
const getUserApplications = async (req, res) => {
  try {
    // Check if user is requesting their own applications or is admin
    if (req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications'
      });
    }

    const applications = await Application.find({ applicantId: req.params.userId })
      .populate('applicantId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('applicantId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  submitApplication,
  getApplication,
  getUserApplications,
  getAllApplications
};