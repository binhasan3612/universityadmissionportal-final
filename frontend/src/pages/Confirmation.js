import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Confirmation.css';

const Confirmation = () => {
  const [applicationData, setApplicationData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get application data from sessionStorage
    const data = sessionStorage.getItem('applicationData');
    if (data) {
      setApplicationData(JSON.parse(data));
    } else {
      // If no data found, redirect to apply page
      navigate('/apply');
    }
  }, [navigate]);

  if (!applicationData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEligibilityBadge = (status) => {
    return status === 'Pass' ? (
      <span className="badge badge-success">
        <i className="fas fa-check-circle"></i>
        Eligible
      </span>
    ) : (
      <span className="badge badge-danger">
        <i className="fas fa-times-circle"></i>
        Not Eligible
      </span>
    );
  };

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          {/* Success Header */}
          <div className="confirmation-header">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1>Application Submitted Successfully!</h1>
            <p>Your application has been received and is being processed.</p>
          </div>

          {/* Personal Information */}
          <div className="application-details">
            <h2>Personal Information</h2>
            <div className="details-grid">
              <div className="detail-item"><label>Application ID:</label><span className="application-id">{applicationData._id}</span></div>
              <div className="detail-item"><label>Full Name:</label><span>{applicationData.fullName}</span></div>
              <div className="detail-item"><label>Email:</label><span>{applicationData.email}</span></div>
              <div className="detail-item"><label>Phone:</label><span>{applicationData.phone}</span></div>
              <div className="detail-item"><label>Date of Birth:</label><span>{formatDate(applicationData.dateOfBirth)}</span></div>
              <div className="detail-item"><label>Medium of Study:</label><span>{applicationData.mediumOfStudy}</span></div>
              <div className="detail-item"><label>Department Choice:</label><span>{applicationData.departmentChoice}</span></div>
              <div className="detail-item"><label>Submission Date:</label><span>{formatDate(applicationData.createdAt)}</span></div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="academic-section">
            <h2>Academic Information</h2>
            {applicationData.mediumOfStudy === 'Bangla' ? (
              <div className="academic-grid">
                <div className="academic-item"><label>SSC GPA:</label><span>{applicationData.sscGPA}</span></div>
                <div className="academic-item"><label>HSC GPA:</label><span>{applicationData.hscGPA}</span></div>
              </div>
            ) : (
              <>
                <div className="results-section">
                  <h4>O-Level Results</h4>
                  <div className="results-grid">
                    {applicationData.oLevelResults?.map((result, index) => (
                      <div key={index} className="result-item">
                        <span>{result.subject}</span>
                        <span className="grade">{result.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="results-section">
                  <h4>A-Level Results</h4>
                  <div className="results-grid">
                    {applicationData.aLevelResults?.map((result, index) => (
                      <div key={index} className="result-item">
                        <span>{result.subject}</span>
                        <span className="grade">{result.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Eligibility Status */}
          <div className="eligibility-section">
            <h2>Eligibility Status</h2>
            <div className="eligibility-info">
              {getEligibilityBadge(applicationData.eligibilityStatus)}
              <span className="eligibility-score">Score: {applicationData.eligibilityScore}</span>
            </div>
            {applicationData.eligibilityStatus === 'Pass' ? (
              <p className="eligibility-message success"><i className="fas fa-thumbs-up"></i>Congratulations! You meet the eligibility criteria for admission.</p>
            ) : (
              <p className="eligibility-message error"><i className="fas fa-info-circle"></i>Unfortunately, you do not meet the minimum eligibility criteria at this time.</p>
            )}
          </div>

          {/* Action Button */}
          <div className="confirmation-actions">
            <button 
              onClick={() => window.print()} 
              className="btn btn-outline btn-large"
            >
              <i className="fas fa-print"></i>
              Print Application
            </button>
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>
                <i className="fas fa-envelope"></i>
                You will receive a confirmation email within 24 hours
              </li>
              <li>
                <i className="fas fa-clock"></i>
                Application processing takes 3-5 business days
              </li>
              <li>
                <i className="fas fa-bell"></i>
                Check your dashboard regularly for updates
              </li>
              <li>
                <i className="fas fa-phone"></i>
                Contact us if you have any questions: 
                <a href="tel:5551234567" className="contact-link" style={{ color: '#21808d', textDecoration: 'underline', marginLeft: 4 }}>
                  (555) 123-4567
                </a>
                {" or "}
                <a href="mailto:admissions@university.edu" className="contact-link" style={{ color: '#21808d', textDecoration: 'underline', marginLeft: 4 }}>
                  admissions@university.edu
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;