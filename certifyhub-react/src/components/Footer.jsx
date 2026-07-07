import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content glass-panel">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Certify<span>Hub</span></h3>
            <p>Your one-stop destination to compare and discover professional certifications online.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/jobs">Trending Jobs</Link>
            <Link to="/about">About Us</Link>
          </div>
          <div className="footer-providers">
            <h4>Supported Platforms</h4>
            <span>Udemy</span>
            <span>Coursera</span>
            <span>Great Learning</span>
            <span>LinkedIn Jobs</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CertifyHub. Thanks for visiting!</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .footer-container {
          padding: 0 24px 24px;
          margin-top: auto;
        }

        .footer-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 40px 20px;
          border-radius: var(--radius-md);
          background: rgba(22, 24, 32, 0.4);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-brand h3 {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .footer-brand h3 span {
          color: var(--primary);
        }

        .footer-brand p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          max-width: 320px;
          line-height: 1.6;
        }

        .footer-links, .footer-providers {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links h4, .footer-providers h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }

        .footer-links a {
          font-size: 0.85rem;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .footer-links a:hover {
          color: var(--primary);
          padding-left: 4px;
        }

        .footer-providers span {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .footer-bottom {
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .footer-content {
            padding: 30px 20px 20px;
          }
        }
      `}} />
    </footer>
  );
}
