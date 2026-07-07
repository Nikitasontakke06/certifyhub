import React from "react";
import { Star, Clock, Award, ShieldAlert, Check } from "lucide-react";

export default function CourseCard({ course, isCompared, onToggleCompare }) {
  const getProviderClass = (provider) => {
    switch (provider.toLowerCase()) {
      case "udemy": return "prov-udemy";
      case "coursera": return "prov-coursera";
      case "great learning": return "prov-gl";
      default: return "";
    }
  };

  return (
    <div className="course-card-el glass-panel glass-panel-hover fade-in">
      <div className="card-header">
        <span className={`provider-tag ${getProviderClass(course.provider)}`}>
          {course.provider}
        </span>
        <span className="price-tag">
          {course.price === 0 ? "FREE" : `$${course.price.toFixed(2)}`}
        </span>
      </div>

      <h3 className="course-title">{course.title}</h3>
      <p className="course-desc">{course.description}</p>

      <div className="course-stats">
        <div className="stat-item" title="Rating">
          <Star size={16} fill="var(--primary)" color="var(--primary)" />
          <span className="stat-text bold-text">{course.rating}</span>
          <span className="stat-muted">({course.reviewsCount.toLocaleString()})</span>
        </div>
        <div className="stat-item" title="Duration">
          <Clock size={16} />
          <span className="stat-text">{course.duration}</span>
        </div>
        <div className="stat-item" title="Level">
          <Award size={16} />
          <span className="stat-text">{course.level}</span>
        </div>
      </div>

      <div className="card-actions">
        <a 
          href={course.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-secondary card-link-btn"
        >
          Go to Course
        </a>
        <button 
          onClick={() => onToggleCompare(course)} 
          className={`btn-primary compare-btn ${isCompared ? "compared" : ""}`}
        >
          {isCompared ? <Check size={16} /> : null}
          <span>{isCompared ? "Compared" : "Compare"}</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .course-card-el {
          display: flex;
          flex-direction: column;
          padding: 24px;
          height: 100%;
          min-height: 280px;
          background: rgba(22, 24, 32, 0.6);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .provider-tag {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
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

        .price-tag {
          font-weight: 800;
          font-size: 1.05rem;
          color: #fff;
        }

        .course-title {
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 10px;
          color: #fff;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 3.08rem;
        }

        .course-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 3.82rem;
        }

        .course-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: auto;
          margin-bottom: 20px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .stat-text {
          font-weight: 500;
          color: var(--text-primary);
        }

        .bold-text {
          font-weight: 700;
        }

        .stat-muted {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .card-link-btn {
          justify-content: center;
          padding: 8px 12px;
          font-size: 0.85rem;
        }

        .compare-btn {
          padding: 8px 12px;
          font-size: 0.85rem;
          justify-content: center;
        }

        .compare-btn.compared {
          background: var(--primary-light);
          border: 1px solid var(--primary);
          color: var(--primary);
          box-shadow: none;
        }

        .compare-btn.compared:hover {
          background: rgba(255, 115, 0, 0.25);
        }
      `}} />
    </div>
  );
}
