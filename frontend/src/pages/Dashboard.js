import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    if (user && user._id) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getUserApplications(user._id);
      setApplications(response.data.data);
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pass: { class: 'success', icon: 'fa-check-circle', text: 'Eligible' },
      Fail: { class: 'danger', icon: 'fa-times-circle', text: 'Not Eligible' },
      Pending: { class: 'warning', icon: 'fa-clock', text: 'Under Review' }
    };
    
    const config = statusConfig[status] || statusConfig.Pending;
    
    return (
      <span className={`badge badge-${config.class}`}>
        <i className={`fas ${config.icon}`}></i>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.fullName}!</h1>
            <p>Here's an overview of your admission applications</p>
          </div>
          
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="stat-info">
                <h3>{applications.length}</h3>
                <p>Total Applications</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{applications.filter(app => app.eligibilityStatus === 'Pass').length}</h3>
                <p>Eligible Applications</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <h3>{applications.filter(app => app.eligibilityStatus === 'Pending').length}</h3>
                <p>Under Review</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="applications-section">
          <div className="section-header">
            <h2>Your Applications</h2>
            {applications.length === 0 && (
              <Link to="/apply" className="btn btn-primary">
                <i className="fas fa-plus"></i>
                Submit New Application
              </Link>
            )}
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-inbox"></i>
              </div>
              <h3>No Applications Found</h3>
              <p>You haven't submitted any applications yet. Start your journey by applying now!</p>
              <Link to="/apply" className="btn btn-primary btn-large">
                <i className="fas fa-paper-plane"></i>
                Submit Your First Application
              </Link>
            </div>
          ) : (
            <div className="applications-grid">
              {applications.map((application) => (
                <div key={application._id} className="application-card">
                  <div className="card-header">
                    <div className="application-info">
                      <h3>{application.departmentChoice}</h3>
                      <p className="application-id">ID: {application._id}</p>
                    </div>
                    {getStatusBadge(application.eligibilityStatus)}
                  </div>

                  <div className="card-content">
                    <div className="detail-row">
                      <span className="label">Medium:</span>
                      <span className="value">{application.mediumOfStudy}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Submitted:</span>
                      <span className="value">{formatDate(application.createdAt)}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Score:</span>
                      <span className="value">{application.eligibilityScore}</span>
                    </div>

                    {application.mediumOfStudy === 'Bangla' ? (
                      <div className="academic-info">
                        <span>SSC: {application.sscGPA}</span>
                        <span>HSC: {application.hscGPA}</span>
                      </div>
                    ) : (
                      <div className="academic-info">
                        <span>O-Levels: {application.oLevelResults?.length}</span>
                        <span>A-Levels: {application.aLevelResults?.length}</span>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <Link 
                      to={`/application/${application._id}`} 
                      className="btn btn-outline btn-small"
                    >
                      <i className="fas fa-eye"></i>
                      View Details
                    </Link>
                    
                    <button 
                      onClick={() => window.print()} 
                      className="btn btn-outline btn-small"
                    >
                      <i className="fas fa-download"></i>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="help-section">
          <div className="help-card">
            <div className="help-icon">
              <i className="fas fa-question-circle"></i>
            </div>
            <div className="help-content">
              <h3>Need Help?</h3>
              <p>
                If you have any questions about your application or the admission process, 
                our support team is here to help.
              </p>
              <div className="help-contacts">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>(555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>admissions@university.edu</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-clock"></i>
                  <span>Mon-Fri, 9AM-5PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;