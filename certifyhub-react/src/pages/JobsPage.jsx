import React, { useState } from "react";
import { Briefcase, Search, ExternalLink, ShieldAlert, Award, DollarSign } from "lucide-react";
import { JOBS_DATA } from "../data/mockData";

export default function JobsPage() {
  const [searchVal, setSearchVal] = useState("");

  const filteredJobs = JOBS_DATA.filter(job => 
    job.title.toLowerCase().includes(searchVal.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchVal.toLowerCase()))
  );

  return (
    <div className="jobs-page page-container">
      <div className="jobs-header fade-in">
        <h1>Trending Careers & Jobs</h1>
        <p>Explore high-demand tech sectors, expected salary scales, and required skill maps.</p>
        
        {/* Jobs Search Filter */}
        <div className="jobs-search-bar glass-panel">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by job title or core skills (e.g. SQL, Solidity)..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="jobs-search-input"
          />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="jobs-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="job-card glass-panel glass-panel-hover fade-in">
              <div className="job-card-header">
                <div className="title-area">
                  <Briefcase size={22} color="var(--primary)" />
                  <h3>{job.title}</h3>
                </div>
                <div className="salary-badge">
                  <DollarSign size={14} />
                  <span>{job.salary}</span>
                </div>
              </div>

              <p className="job-desc">{job.description}</p>

              <div className="skills-area">
                <h4>Required Competencies:</h4>
                <div className="skills-tags">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="job-card-action">
                <a 
                  href={job.link}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary linkedin-search-btn"
                >
                  <span>Search Jobs on LinkedIn</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-jobs-found glass-panel fade-in">
            <ShieldAlert size={36} color="var(--text-muted)" />
            <h3>No jobs found</h3>
            <p>We couldn't find any career categories matching "{searchVal}". Try modifying your search query.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .jobs-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .jobs-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }

        .jobs-header p {
          color: var(--text-secondary);
          font-size: 1rem;
          margin-bottom: 24px;
        }

        .jobs-search-bar {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          border-radius: var(--radius-md);
          max-width: 500px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
        }

        .jobs-search-bar:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .jobs-search-bar .search-icon {
          color: var(--text-muted);
          margin-right: 12px;
        }

        .jobs-search-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.9rem;
          width: 100%;
          outline: none;
        }

        /* Jobs Grid Styling */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .job-card {
          padding: 28px;
          background: rgba(22, 24, 32, 0.5);
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
        }

        .job-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .title-area {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .title-area h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .salary-badge {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background: var(--primary-light);
          color: var(--primary);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 115, 0, 0.2);
          white-space: nowrap;
        }

        .job-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .skills-area {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skills-area h4 {
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-tag {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .job-card-action {
          margin-top: auto;
          padding-top: 10px;
        }

        .linkedin-search-btn {
          width: 100%;
          justify-content: center;
          padding: 10px;
          font-size: 0.85rem;
        }

        .no-jobs-found {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          text-align: center;
          gap: 12px;
        }

        .no-jobs-found h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .no-jobs-found p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          max-width: 320px;
        }

        @media (max-width: 576px) {
          .job-card {
            padding: 20px;
          }
          .job-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}} />
    </div>
  );
}
