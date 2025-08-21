const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('applicant', 'admin').default('applicant')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const applicationSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required(),
  dateOfBirth: Joi.date().max('now').required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{11}$/).required(),
  mediumOfStudy: Joi.string().valid('Bangla', 'English').required(),
  sscGPA: Joi.when('mediumOfStudy', {
    is: 'Bangla',
    then: Joi.number().min(0).max(5).required(),
    otherwise: Joi.number().optional()
  }),
  hscGPA: Joi.when('mediumOfStudy', {
    is: 'Bangla',
    then: Joi.number().min(0).max(5).required(),
    otherwise: Joi.number().optional()
  }),
  oLevelResults: Joi.when('mediumOfStudy', {
    is: 'English',
    then: Joi.array().items(
      Joi.object({
        subject: Joi.string().required(),
        grade: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F').required()
      })
    ).min(5).required(),
    otherwise: Joi.array().optional()
  }),
  aLevelResults: Joi.when('mediumOfStudy', {
    is: 'English',
    then: Joi.array().items(
      Joi.object({
        subject: Joi.string().required(),
        grade: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F').required()
      })
    ).min(2).required(),
    otherwise: Joi.array().optional()
  }),
  departmentChoice: Joi.string().valid('CSE', 'BBA', 'English').required()
});

// Validation middleware
const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

const validateApplication = (req, res, next) => {
  const { error } = applicationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateApplication
};