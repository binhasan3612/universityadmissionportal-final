import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to FTS university</h1>
            <p>
              Shape your future with our world-class education programs. 
              Join thousands of students who have transformed their lives 
              through our innovative curriculum and exceptional faculty.
            </p>
            <div className="hero-buttons">
              <Link 
                to="/apply"
                className="btn btn-primary btn-large"
              >
                <i className="fas fa-rocket"></i>
                Apply Now
              </Link>
              <a href="#programs" className="btn btn-outline btn-large">
                <i className="fas fa-info-circle"></i>
                Learn More
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <i className="fas fa-graduation-cap"></i>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="section-header">
            <h2>About FTS university</h2>
            <p>Committed to academic excellence and student success</p>
          </div>
          <div className="about-content">
            <div className="about-text">
              <h3>Excellence in Education Since 1985</h3>
              <p>
                FTS university has been at the forefront of higher education for over 
                three decades. We pride ourselves on providing quality education that 
                prepares students for successful careers in their chosen fields.
              </p>
              <ul>
                <li><i className="fas fa-check"></i> World-class faculty and research facilities</li>
                <li><i className="fas fa-check"></i> Industry-aligned curriculum</li>
                <li><i className="fas fa-check"></i> Strong alumni network</li>
                <li><i className="fas fa-check"></i> 95% graduate employment rate</li>
              </ul>
            </div>
            <div className="about-stats">
              <div className="stat">
                <h4>15,000+</h4>
                <p>Students</p>
              </div>
              <div className="stat">
                <h4>500+</h4>
                <p>Faculty</p>
              </div>
              <div className="stat">
                <h4>50+</h4>
                <p>Programs</p>
              </div>
              <div className="stat">
                <h4>98%</h4>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="programs">
        <div className="container">
          <div className="section-header">
            <h2>Our Academic Programs</h2>
            <p>Choose from our diverse range of undergraduate programs</p>
          </div>
          <div className="programs-grid">
            <div className="program-card">
              <div className="program-icon">
                <i className="fas fa-code"></i>
              </div>
              <h3>Computer Science & Engineering</h3>
              <p>
                Master the art of programming, software development, and cutting-edge 
                technologies. Our CSE program prepares you for the digital future.
              </p>
              <ul>
                <li>Software Development</li>
                <li>Artificial Intelligence</li>
                <li>Data Science</li>
                <li>Cybersecurity</li>
              </ul>
              <Link to="/apply" className="btn btn-outline">Apply Now</Link>
            </div>

            <div className="program-card">
              <div className="program-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Business Administration</h3>
              <p>
                Develop leadership skills and business acumen to excel in the 
                corporate world. Our BBA program covers all aspects of modern business.
              </p>
              <ul>
                <li>Management</li>
                <li>Marketing</li>
                <li>Finance</li>
                <li>Entrepreneurship</li>
              </ul>
              <Link to="/apply" className="btn btn-outline">Apply Now</Link>
            </div>

            <div className="program-card">
              <div className="program-icon">
                <i className="fas fa-book-open"></i>
              </div>
              <h3>English Literature</h3>
              <p>
                Explore the rich world of literature, develop critical thinking, 
                and enhance your communication skills through our English program.
              </p>
              <ul>
                <li>Creative Writing</li>
                <li>Literary Analysis</li>
                <li>Communication Skills</li>
                <li>Media Studies</li>
              </ul>
              <Link to="/apply" className="btn btn-outline">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join our community of learners and shape your future today.</p>
            <div className="cta-buttons">
              {/* Registration removed */}
              <Link to="/apply" className="btn btn-outline btn-large">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;