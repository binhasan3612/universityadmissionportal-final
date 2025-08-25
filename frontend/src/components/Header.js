import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <i className="fas fa-graduation-cap"></i>
            <span>FTS university</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/apply" className="nav-link">Admissions</Link>
            <a href="#programs" className="nav-link">Programs</a>
            <Link to="/contact" className="nav-link">Contact Us</Link>
            {/* Auth Links Desktop */}
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            ) : (
              <button className="btn classy-logout" onClick={handleLogout} title="Logout">
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="nav-mobile">
            <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/apply" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Admissions
            </Link>
            <a href="#programs" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Programs
            </a>
            <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Contact Us
            </Link>
            {/* Auth Links Mobile */}
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              </>
            ) : (
              <button className="btn classy-logout" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} title="Logout">
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;