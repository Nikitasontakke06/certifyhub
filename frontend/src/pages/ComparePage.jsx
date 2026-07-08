import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, ExternalLink, Trash2, Award, CheckCircle } from "lucide-react";

export default function ComparePage({ compareList, onRemove, onClear }) {
  const getProviderClass = (provider) => {
    switch (provider.toLowerCase()) {
      case "udemy": return "prov-udemy";
      case "coursera": return "prov-coursera";
      case "great learning": return "prov-gl";
      case "pw skills": return "prov-pw";
      case "simplilearn": return "prov-simplilearn";
      case "swayam": return "prov-swayam";
      case "scrimba": return "prov-scrimba";
      case "datacamp": return "prov-datacamp";
      case "interaction design foundation": return "prov-ixdf";
      case "hack design": return "prov-hackdesign";
      case "ine": return "prov-ine";
      case "tryhackme": return "prov-tryhackme";
      case "fast.ai": return "prov-fastai";
      case "hubspot academy": return "prov-hubspot";
      case "kodekloud": return "prov-kodekloud";
      case "project management institute (pmi)": return "prov-pmi";
      default: return "prov-generic";
    }
  };

  React.useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (savedUser && compareList && compareList.length >= 2) {
      try {
        const userObj = JSON.parse(savedUser);
        if (userObj && userObj.email) {
          fetch("/api/comparison-history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userObj.email,
              courseIds: compareList.map(c => c.id)
            })
          }).catch(err => console.error("Error logging comparison history:", err));
        }
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
  }, [compareList]);

  // Find the cheapest/highest rated courses for highlighting
  const cheapest = compareList.length > 0 ? Math.min(...compareList.map(c => c.price)) : 0;
  const bestRated = compareList.length > 0 ? Math.max(...compareList.map(c => c.rating)) : 0;

  if (compareList.length < 2) {
    return (
      <div className="compare-empty page-container fade-in">
        <div className="empty-message-container glass-panel">
          <Award size={48} color="var(--primary)" className="empty-icon animate-pulse" />
          <h2>Comparison Engine Empty</h2>
          <p>Please select at least 2 certification courses to compare their price structures, durations, and reviews.</p>
          <Link to="/courses" className="btn-primary back-to-courses-btn">
            <ArrowLeft size={16} />
            <span>Browse Courses</span>
          </Link>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          .compare-empty {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 70vh;
          }
          .empty-message-container {
            max-width: 500px;
            padding: 48px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }
          .empty-icon {
            margin-bottom: 8px;
          }
          .empty-message-container h2 {
            font-size: 1.5rem;
            color: var(--text-primary);
            font-weight: 700;
          }
          .empty-message-container p {
            color: var(--text-secondary);
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 8px;
          }
          .back-to-courses-btn {
            font-size: 0.9rem;
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="compare-page page-container">
      <div className="compare-header fade-in">
        <Link to="/courses" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Courses</span>
        </Link>
        
        <div className="header-title-row">
          <div>
            <h1>Compare Certifications</h1>
            <p>Analyze key differences side-by-side to make an informed investment in your career.</p>
          </div>
          <button onClick={onClear} className="btn-secondary clear-matrix-btn">
            <Trash2 size={16} />
            <span>Clear Matrix</span>
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="matrix-wrapper glass-panel fade-in">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="feature-col">Feature</th>
              {compareList.map(course => (
                <th key={course.id} className="course-col">
                  <div className="table-header-course">
                    <span className={`provider-tag ${getProviderClass(course.provider)}`}>
                      {course.provider}
                    </span>
                    <button 
                      onClick={() => onRemove(course)} 
                      className="remove-from-table-btn"
                      title="Remove from comparison"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="course-table-title">{course.title}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price Row */}
            <tr>
              <td className="feature-col font-bold">Cost</td>
              {compareList.map(course => {
                const isCheapest = course.price === cheapest;
                return (
                  <td key={course.id} className="course-col font-medium">
                    <span className="price-val">
                      {course.price === 0 ? "FREE" : `₹${course.price.toLocaleString("en-IN")}`}
                    </span>
                    {isCheapest && (
                      <span className="highlight-badge cheapest-badge">Best Price</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Rating Row */}
            <tr>
              <td className="feature-col font-bold">Reviews & Rating</td>
              {compareList.map(course => {
                const isBestRated = course.rating === bestRated;
                return (
                  <td key={course.id} className="course-col">
                    <div className="rating-row">
                      <Star size={16} fill="var(--primary)" color="var(--primary)" />
                      <span className="bold-rating">{course.rating}</span>
                      <span className="reviews-count">({course.reviewsCount.toLocaleString()} reviews)</span>
                    </div>
                    {isBestRated && (
                      <span className="highlight-badge rated-badge">Top Rated</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Duration Row */}
            <tr>
              <td className="feature-col font-bold">Duration</td>
              {compareList.map(course => (
                <td key={course.id} className="course-col">
                  {course.duration}
                </td>
              ))}
            </tr>

            {/* Level Row */}
            <tr>
              <td className="feature-col font-bold">Skill Level</td>
              {compareList.map(course => (
                <td key={course.id} className="course-col">
                  {course.level}
                </td>
              ))}
            </tr>

            {/* Key Features Row */}
            <tr>
              <td className="feature-col font-bold">Inclusions</td>
              {compareList.map(course => (
                <td key={course.id} className="course-col">
                  <ul className="table-features-list">
                    {course.features.map((feat, idx) => (
                      <li key={idx}>
                        <CheckCircle size={12} color="var(--success)" className="check-icon" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Description Row */}
            <tr>
              <td className="feature-col font-bold">Overview</td>
              {compareList.map(course => (
                <td key={course.id} className="course-col desc-text">
                  {course.description}
                </td>
              ))}
            </tr>

            {/* CTA Row */}
            <tr>
              <td className="feature-col"></td>
              {compareList.map(course => (
                <td key={course.id} className="course-col">
                  <a 
                    href={course.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary table-cta-btn"
                  >
                    <span>Enroll Now</span>
                    <ExternalLink size={14} />
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .compare-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .compare-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          align-self: flex-start;
        }

        .back-link:hover {
          color: var(--primary);
        }

        .header-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-title-row h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .header-title-row p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .clear-matrix-btn {
          font-size: 0.85rem;
        }

        /* Matrix Table Styling */
        .matrix-wrapper {
          overflow-x: auto;
          background: var(--bg-glass);
          padding: 8px;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
          min-width: 800px;
        }

        .comparison-table th, .comparison-table td {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          vertical-align: top;
        }

        .comparison-table tr:last-child td {
          border-bottom: none;
        }

        .feature-col {
          width: 180px;
          color: var(--text-secondary);
          background: rgba(15, 23, 42, 0.04);
          position: sticky;
          left: 0;
          z-index: 10;
        }

        .font-bold {
          font-weight: 700;
          color: var(--text-primary);
        }

        .font-medium {
          font-weight: 600;
        }

        .course-col {
          min-width: 250px;
          border-left: 1px solid var(--border-color);
        }

        .table-header-course {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .remove-from-table-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .remove-from-table-btn:hover {
          color: var(--error);
          background: rgba(239, 68, 68, 0.1);
        }

        .course-table-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .price-val {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-right: 10px;
        }

        .highlight-badge {
          display: inline-flex;
          align-items: center;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .cheapest-badge {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .rated-badge {
          background: rgba(29, 92, 255, 0.15);
          color: var(--primary);
          border: 1px solid rgba(29, 92, 255, 0.3);
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .bold-rating {
          font-weight: 700;
          color: var(--text-primary);
        }

        .reviews-count {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .table-features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .table-features-list li {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .check-icon {
          flex-shrink: 0;
          margin-top: 3px;
        }

        .desc-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .table-cta-btn {
          width: 100%;
          justify-content: center;
          padding: 10px;
          font-size: 0.85rem;
        }

        .provider-tag {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .prov-udemy {
          background: rgba(164, 53, 240, 0.15);
          color: #a435f0;
          border: 1px solid rgba(164, 53, 240, 0.3);
        }

        .prov-coursera {
          background: rgba(0, 86, 210, 0.15);
          color: #3b82f6;
          border: 1px solid rgba(0, 86, 210, 0.3);
        }

        .prov-gl {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .prov-pw {
          background: rgba(0, 200, 255, 0.15);
          color: #00c8ff;
          border: 1px solid rgba(0, 200, 255, 0.3);
        }

        .prov-simplilearn {
          background: rgba(29, 92, 255, 0.15);
          color: var(--primary);
          border: 1px solid rgba(29, 92, 255, 0.3);
        }

        .prov-swayam {
          background: rgba(255, 215, 0, 0.15);
          color: #ffd700;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .prov-scrimba {
          background: rgba(244, 63, 94, 0.15);
          color: #f43f5e;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }

        .prov-datacamp {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .prov-ixdf {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .prov-hackdesign {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .prov-ine {
          background: rgba(6, 182, 212, 0.15);
          color: #06b6d4;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .prov-tryhackme {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .prov-fastai {
          background: rgba(99, 102, 241, 0.15);
          color: #6366f1;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .prov-hubspot {
          background: rgba(249, 115, 22, 0.15);
          color: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.3);
        }

        .prov-kodekloud {
          background: rgba(139, 92, 246, 0.15);
          color: #8b5cf6;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .prov-pmi {
          background: rgba(148, 163, 184, 0.15);
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }

        .prov-generic {
          background: rgba(29, 92, 255, 0.1);
          color: var(--text-secondary);
          border: 1px solid rgba(29, 92, 255, 0.18);
        }
      `}} />
    </div>
  );
}
