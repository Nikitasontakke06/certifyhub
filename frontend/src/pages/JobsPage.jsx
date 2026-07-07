import React, { useState, useEffect } from "react";
import { Briefcase, Search, ExternalLink, ShieldAlert, IndianRupee } from "lucide-react";

function JobCard({ job }) {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetch(`/api/jobs/${job.id}/history`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoadingHistory(false);
      })
      .catch(err => {
        console.error("Error loading job history:", err);
        setLoadingHistory(false);
      });
  }, [job.id]);

  // Construct points for SVG Sparkline
  let pointsStr = "";
  if (history.length > 1) {
    const counts = history.map(h => h.openingsCount);
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    const range = max - min || 1;
    
    pointsStr = history.map((h, i) => {
      const x = (i / (history.length - 1)) * 90;
      const y = 30 - ((h.openingsCount - min) / range) * 20 - 5;
      return `${x},${y}`;
    }).join(" ");
  }

  const isPositive = job.dailyGrowthRate >= 0;

  return (
    <div className="job-card glass-panel glass-panel-hover fade-in">
      <div className="job-card-header">
        <div className="title-row">
          <div className="title-area">
            <Briefcase size={22} color="var(--primary)" />
            <h3>{job.title}</h3>
          </div>
          
          <div className="trend-area">
            {loadingHistory ? (
              <span className="spark-loader">...</span>
            ) : history.length > 1 ? (
              <div className="sparkline-container" title="7-day demand trend">
                <svg width="90" height="30" className="sparkline">
                  <polyline
                    fill="none"
                    stroke={isPositive ? "#00c853" : "#ff3d00"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsStr}
                  />
                </svg>
              </div>
            ) : null}
          </div>
        </div>

        <div className="metrics-row">
          <div className="salary-badge">
            <IndianRupee size={14} />
            <span>{job.salary}</span>
          </div>

          {job.dailyGrowthRate !== undefined && (
            <span className={`growth-badge ${isPositive ? "positive" : "negative"}`}>
              {isPositive ? "▲" : "▼"} {Math.abs(job.dailyGrowthRate)}% openings
            </span>
          )}
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
  );
}

export default function JobsPage({ jobs = [], loading }) {
  const [searchVal, setSearchVal] = useState("");

  const filteredJobs = jobs.filter(job => 
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
        {loading ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "var(--text-secondary)" }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: 12 }}>Connecting to database, loading jobs...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
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
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
        }

        .title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          gap: 12px;
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

        .trend-area {
          height: 30px;
          display: flex;
          align-items: center;
        }

        .sparkline-container {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
          padding: 2px 4px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .sparkline {
          display: block;
          overflow: visible;
        }

        .spark-loader {
          font-size: 0.75rem;
          color: var(--text-muted);
          letter-spacing: 1px;
        }

        .metrics-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .salary-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--primary-light);
          color: var(--primary);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid rgba(255, 115, 0, 0.2);
          white-space: nowrap;
        }

        .growth-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 6px;
        }

        .growth-badge.positive {
          background: rgba(0, 200, 83, 0.08);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.15);
        }

        .growth-badge.negative {
          background: rgba(255, 61, 0, 0.08);
          color: #ff3d00;
          border: 1px solid rgba(255, 61, 0, 0.15);
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
          .title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .trend-area {
            height: auto;
            margin-left: 32px;
          }
        }
      `}} />
    </div>
  );
}
