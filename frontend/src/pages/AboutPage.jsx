import React from "react";
import { Award, Compass, BarChart2, ShieldCheck, Mail, Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="about-page page-container">
      <div className="about-header fade-in">
        <h1>About CertifyHub</h1>
        <p>Providing learners worldwide with clarity and direction in the professional certification landscape.</p>
      </div>

      {/* Main Grid */}
      <div className="about-content">
        <section className="about-hero glass-panel fade-in">
          <h2>Our Mission</h2>
          <p>
            In a fast-growing digital economy, staying competitive requires continuous learning. However, the online education market is fragmented, with hundreds of platforms offering overlapping courses with varying prices, syllabi, and reviews.
          </p>
          <p>
            <strong>CertifyHub</strong> was created to solve this. We aggregate courses from top industry-recognized providers like Udemy, Coursera, and Great Learning into a single, unified search interface. We empower learners to compare features side-by-side, sort by price or popularity, and find the perfect path for their budget and skill level.
          </p>
        </section>

        <section className="features-grid">
          <div className="feature-item glass-panel fade-in">
            <Compass size={28} color="var(--primary)" />
            <h3>Unified Search</h3>
            <p>No more browser tabs cluttering your desktop. Search courses and job roles in one central directory.</p>
          </div>

          <div className="feature-item glass-panel fade-in">
            <BarChart2 size={28} color="var(--primary)" />
            <h3>Side-by-Side Comparison</h3>
            <p>Our comparison matrix lists costs, course ratings, durations, levels, and learning highlights side-by-side.</p>
          </div>

          <div className="feature-item glass-panel fade-in">
            <Award size={28} color="var(--primary)" />
            <h3>Career Mapping</h3>
            <p>Discover job roles in Fullstack Development, Cyber Security, AI, and details on expected salary ranges and must-have skill lists.</p>
          </div>

          <div className="feature-item glass-panel fade-in">
            <ShieldCheck size={28} color="var(--primary)" />
            <h3>Transparent Pricing</h3>
            <p>Instantly compare subscription-based courses, direct purchase bootcamps, and 100% free courses.</p>
          </div>
        </section>

        <section className="contact-card glass-panel fade-in">
          <Mail size={32} color="var(--primary)" className="mail-icon" />
          <h2>Get in Touch</h2>
          <p>Have suggestions on new course providers to add or ideas to improve comparison layouts? We would love to hear from you!</p>
          <a href="mailto:support@certifyhub.com" className="btn-primary contact-link-btn">
            Contact Support
          </a>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .about-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .about-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }

        .about-header p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .about-content {
          display: grid;
          grid-template-columns: 2fr 1.5fr;
          gap: 32px;
          align-items: start;
        }

        .about-hero {
          grid-column: 1 / -1;
          padding: 40px;
          background: rgba(22, 24, 32, 0.4);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .about-hero h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
        }

        .about-hero p {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .about-hero strong {
          color: var(--primary);
        }

        /* Features Grid Styling */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .feature-item {
          padding: 28px;
          background: rgba(22, 24, 32, 0.5);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-item h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
        }

        .feature-item p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Contact Card */
        .contact-card {
          padding: 40px;
          background: rgba(22, 24, 32, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          border: 1px solid var(--border-color);
        }

        .contact-card h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .contact-card p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          max-width: 320px;
          margin-bottom: 8px;
        }

        .contact-link-btn {
          width: 100%;
          justify-content: center;
          padding: 12px;
          font-size: 0.9rem;
        }

        @media (max-width: 992px) {
          .about-content {
            grid-template-columns: 1fr;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
}
