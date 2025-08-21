import React from 'react';
import '../styles/Home.css';

const Contact = () => (
  <div className="container" style={{ padding: '2rem 0' }}>
    <h1>Contact Us</h1>
    <p>For any inquiries or support, please reach out to us:</p>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <li><strong>Email:</strong> <a href="mailto:admissions@fts-university.edu">admissions@fts-university.edu</a></li>
      <li><strong>Phone:</strong> <a href="tel:5551234567">+1 (555) 123-4567</a></li>
      <li><strong>Address:</strong> 123 University Ave, City, Country</li>
    </ul>
  </div>
);

export default Contact;
