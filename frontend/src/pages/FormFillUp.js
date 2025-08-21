import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Form.css';

const FormFillUp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    dateOfBirth: '',
    email: user?.email || '',
    phone: '',
    mediumOfStudy: '',
    sscGPA: '',
    hscGPA: '',
    oLevelResults: [
      { subject: '', grade: '' },
      { subject: '', grade: '' },
      { subject: '', grade: '' },
      { subject: '', grade: '' },
      { subject: '', grade: '' }
    ],
    aLevelResults: [
      { subject: '', grade: '' },
      { subject: '', grade: '' }
    ],
    departmentChoice: ''
  });

  const grades = ['A', 'B', 'C', 'D', 'E', 'F'];
  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language',
    'English Literature', 'History', 'Geography', 'Economics', 'Business Studies',
    'Computer Science', 'Art', 'Music', 'Physical Education'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleResultChange = (type, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addMoreResults = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { subject: '', grade: '' }]
    }));
  };

  const removeResult = (type, index) => {
    const minLength = type === 'oLevelResults' ? 5 : 2;
    if (formData[type].length > minLength) {
      setFormData(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    if (!formData.mediumOfStudy) {
      setError('Please select your medium of study');
      return false;
    }

    if (formData.mediumOfStudy === 'Bangla') {
      if (!formData.sscGPA || !formData.hscGPA) {
        setError('SSC and HSC GPA are required for Bangla medium students');
        return false;
      }
      if (parseFloat(formData.sscGPA) < 4.0 || parseFloat(formData.hscGPA) < 4.0) {
        setError('Both SSC and HSC GPA must be 4.0 or higher for eligibility');
        return false;
      }
    }

    if (formData.mediumOfStudy === 'English') {
      const filledOLevels = formData.oLevelResults.filter(r => r.subject && r.grade);
      const filledALevels = formData.aLevelResults.filter(r => r.subject && r.grade);
      
      if (filledOLevels.length < 5) {
        setError('At least 5 O-Level results are required for English medium students');
        return false;
      }
      if (filledALevels.length < 2) {
        setError('At least 2 A-Level results are required for English medium students');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare data based on medium
      let submissionData = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        mediumOfStudy: formData.mediumOfStudy,
        departmentChoice: formData.departmentChoice
      };

      if (formData.mediumOfStudy === 'Bangla') {
        submissionData.sscGPA = parseFloat(formData.sscGPA);
        submissionData.hscGPA = parseFloat(formData.hscGPA);
      } else {
        submissionData.oLevelResults = formData.oLevelResults.filter(r => r.subject && r.grade);
        submissionData.aLevelResults = formData.aLevelResults.filter(r => r.subject && r.grade);
      }

      const response = await applicationAPI.submit(submissionData);
      
      // Store application data in sessionStorage for confirmation page
      sessionStorage.setItem('applicationData', JSON.stringify(response.data.data));
      
      navigate('/confirmation');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-header">
          <h1>FTS university Admission Application</h1>
          <p>Please fill out all required information accurately</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admission-form">
          {/* Personal Information */}
          <div className="form-section">
            <h2><i className="fas fa-user"></i> Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  pattern="[0-9]{11}"
                  required
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="form-section">
            <h2><i className="fas fa-graduation-cap"></i> Academic Information</h2>
            
            <div className="form-group">
              <label htmlFor="mediumOfStudy">Medium of Study *</label>
              <select
                id="mediumOfStudy"
                name="mediumOfStudy"
                value={formData.mediumOfStudy}
                onChange={handleChange}
                required
              >
                <option value="">Select Medium</option>
                <option value="Bangla">Bangla Medium</option>
                <option value="English">English Medium</option>
              </select>
            </div>

            {/* Bangla Medium Fields */}
            {formData.mediumOfStudy === 'Bangla' && (
              <div className="medium-section">
                <h3>Bangla Medium Requirements</h3>
                <p className="requirement-note">
                  <i className="fas fa-info-circle"></i>
                  Both SSC and HSC GPA must be 4.0 or higher for eligibility
                </p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="sscGPA">SSC GPA *</label>
                    <input
                      type="number"
                      id="sscGPA"
                      name="sscGPA"
                      value={formData.sscGPA}
                      onChange={handleChange}
                      min="0"
                      max="5"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="hscGPA">HSC GPA *</label>
                    <input
                      type="number"
                      id="hscGPA"
                      name="hscGPA"
                      value={formData.hscGPA}
                      onChange={handleChange}
                      min="0"
                      max="5"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* English Medium Fields */}
            {formData.mediumOfStudy === 'English' && (
              <div className="medium-section">
                <h3>English Medium Requirements</h3>
                <p className="requirement-note">
                  <i className="fas fa-info-circle"></i>
                  Minimum 5 O-Level and 2 A-Level results required. Grade points: A=5, B=4, C=3, D=2
                </p>
                
                {/* O-Level Results */}
                <div className="results-section">
                  <h4>O-Level Results</h4>
                  {formData.oLevelResults.map((result, index) => (
                    <div key={index} className="result-row">
                      <select
                        value={result.subject}
                        onChange={(e) => handleResultChange('oLevelResults', index, 'subject', e.target.value)}
                        required={index < 5}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                      
                      <select
                        value={result.grade}
                        onChange={(e) => handleResultChange('oLevelResults', index, 'grade', e.target.value)}
                        required={index < 5}
                      >
                        <option value="">Grade</option>
                        {grades.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                      
                      {index >= 5 && (
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => removeResult('oLevelResults', index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={() => addMoreResults('oLevelResults')}
                  >
                    <i className="fas fa-plus"></i>
                    Add More O-Level Results
                  </button>
                </div>

                {/* A-Level Results */}
                <div className="results-section">
                  <h4>A-Level Results</h4>
                  {formData.aLevelResults.map((result, index) => (
                    <div key={index} className="result-row">
                      <select
                        value={result.subject}
                        onChange={(e) => handleResultChange('aLevelResults', index, 'subject', e.target.value)}
                        required={index < 2}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                      
                      <select
                        value={result.grade}
                        onChange={(e) => handleResultChange('aLevelResults', index, 'grade', e.target.value)}
                        required={index < 2}
                      >
                        <option value="">Grade</option>
                        {grades.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                      
                      {index >= 2 && (
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => removeResult('aLevelResults', index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={() => addMoreResults('aLevelResults')}
                  >
                    <i className="fas fa-plus"></i>
                    Add More A-Level Results
                  </button>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="departmentChoice">Department Choice *</label>
              <select
                id="departmentChoice"
                name="departmentChoice"
                value={formData.departmentChoice}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science & Engineering</option>
                <option value="BBA">Business Administration</option>
                <option value="English">English Literature</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Submitting Application...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormFillUp;