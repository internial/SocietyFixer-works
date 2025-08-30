import React from 'react';
import { Link } from 'react-router-dom';

/**
 * The main footer for the application.
 * @returns {React.JSX.Element} The rendered Footer component.
 */
export default function Footer() {
  return (
    <footer className="py-4 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1) !important' }}>
      <div className="container text-center text-secondary">
        <div className="d-flex justify-content-center align-items-center mb-2">
          {/* Simple SVG for US Flag */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 32 21.33" className="me-2">
            <rect width="32" height="21.33" fill="#c1272d"/>
            <path fill="#fff" d="M0 2.66h32v2.67H0zm0 5.34h32v2.67H0zm0 5.33h32v2.67H0zm0 5.33h32v2.67H0z"/>
            <rect width="14.67" height="10.67" fill="#002868"/>
          </svg>
          <span className="text-sm">Made in USA</span>
        </div>
        <ul className="list-inline mb-2">
          <li className="list-inline-item mx-2">
            <Link to="/terms-of-service" className="text-secondary text-decoration-none text-sm">Terms of Service</Link>
          </li>
          <li className="list-inline-item mx-2">
            <Link to="/privacy-policy" className="text-secondary text-decoration-none text-sm">Privacy Policy</Link>
          </li>
           <li className="list-inline-item mx-2">
            <Link to="/documentation" className="text-secondary text-decoration-none text-sm">Developer Documentation</Link>
          </li>
        </ul>
        <small className="d-block mb-2">© {new Date().getFullYear()} SocietyFixer. All Rights Reserved.</small>
      </div>
    </footer>
  );
}