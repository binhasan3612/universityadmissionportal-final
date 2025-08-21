const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Now optional for public submissions
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{11}$/, 'Please enter a valid 11-digit phone number']
  },
  mediumOfStudy: {
    type: String,
    required: [true, 'Medium of study is required'],
    enum: ['Bangla', 'English']
  },
  // Bangla Medium fields
  sscGPA: {
    type: Number,
    min: [0, 'GPA cannot be negative'],
    max: [5, 'GPA cannot exceed 5'],
    validate: {
      validator: function(value) {
        return this.mediumOfStudy !== 'Bangla' || (value !== null && value !== undefined);
      },
      message: 'SSC GPA is required for Bangla medium students'
    }
  },
  hscGPA: {
    type: Number,
    min: [0, 'GPA cannot be negative'],
    max: [5, 'GPA cannot exceed 5'],
    validate: {
      validator: function(value) {
        return this.mediumOfStudy !== 'Bangla' || (value !== null && value !== undefined);
      },
      message: 'HSC GPA is required for Bangla medium students'
    }
  },
  // English Medium fields
  oLevelResults: [{
    subject: String,
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F']
    }
  }],
  aLevelResults: [{
    subject: String,
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F']
    }
  }],
  departmentChoice: {
    type: String,
    required: [true, 'Department choice is required'],
    enum: ['CSE', 'BBA', 'English']
  },
  eligibilityStatus: {
    type: String,
    enum: ['Pass', 'Fail'],
    default: 'Fail'
  },
  eligibilityScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate eligibility
applicationSchema.pre('save', function(next) {
  try {
    if (this.mediumOfStudy === 'Bangla') {
      // Bangla Medium: Both SSC and HSC GPA must be >= 4.0
      if (this.sscGPA >= 4.0 && this.hscGPA >= 4.0) {
        this.eligibilityStatus = 'Pass';
        this.eligibilityScore = (this.sscGPA + this.hscGPA) / 2;
      } else {
        this.eligibilityStatus = 'Fail';
        this.eligibilityScore = 0;
      }
    } else if (this.mediumOfStudy === 'English') {
      // English Medium: Calculate points from grades
      const gradePoints = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0 };
      
      // Calculate best 5 O-Level results
      const oLevelPoints = this.oLevelResults
        .map(result => gradePoints[result.grade] || 0)
        .sort((a, b) => b - a)
        .slice(0, 5)
        .reduce((sum, points) => sum + points, 0);
      
      // Calculate best 2 A-Level results
      const aLevelPoints = this.aLevelResults
        .map(result => gradePoints[result.grade] || 0)
        .sort((a, b) => b - a)
        .slice(0, 2)
        .reduce((sum, points) => sum + points, 0);
      
      const totalPoints = oLevelPoints + aLevelPoints;
      this.eligibilityScore = totalPoints;
      
      // Minimum eligibility: 20 points out of 35 (5 O-Levels * 5 + 2 A-Levels * 5)
      if (totalPoints >= 20) {
        this.eligibilityStatus = 'Pass';
      } else {
        this.eligibilityStatus = 'Fail';
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Application', applicationSchema);