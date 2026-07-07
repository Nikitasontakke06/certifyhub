import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Trash2, X, AlertCircle } from "lucide-react";

export default function CompareQueue({ compareList, onRemove, onClear }) {
  if (compareList.length === 0) return null;

  return (
    <div className="compare-queue-container fade-in">
      <div className="compare-queue-content glass-panel">
        <div className="queue-info">
          <span className="queue-count">{compareList.length}</span>
          <span className="queue-label">
            {compareList.length === 1 ? "Course selected to compare" : "Courses selected to compare"}
          </span>
          {compareList.length < 2 && (
            <span className="queue-helper">
              <AlertCircle size={14} style={{ marginRight: 4, color: "var(--info)" }} />
              Select at least 2 courses to compare
            </span>
          )}
        </div>

        <div className="queue-items">
          {compareList.map(course => (
            <div key={course.id} className="queue-item glass-panel">
              <span className="queue-item-title">{course.title}</span>
              <button onClick={() => onRemove(course)} className="remove-item-btn" title="Remove">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="queue-actions">
          <button onClick={onClear} className="btn-secondary clear-btn">
            <Trash2 size={16} />
            <span>Clear</span>
          </button>
          <Link 
            to="/compare" 
            className={`btn-primary compare-now-btn ${compareList.length < 2 ? "disabled-link" : ""}`}
            onClick={(e) => compareList.length < 2 && e.preventDefault()}
          >
            <span>Compare Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .compare-queue-container {
          position: fixed;
          bottom: 24px;
          left: 0;
          width: 100%;
          z-index: 999;
          padding: 0 24px;
        }

        .compare-queue-content {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: rgba(22, 24, 32, 0.9);
          border: 1px solid var(--primary-glow);
          box-shadow: 0 -10px 40px rgba(255, 115, 0, 0.15), var(--shadow-glass);
        }

        .queue-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 220px;
        }

        .queue-count {
          background: var(--primary);
          color: white;
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .queue-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
        }

        .queue-helper {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
        }

        .queue-items {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-grow: 1;
          margin: 0 32px;
          overflow-x: auto;
          padding: 4px 0;
        }

        .queue-items::-webkit-scrollbar {
          height: 4px;
        }

        .queue-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--radius-sm);
          min-width: 150px;
          max-width: 200px;
          flex-shrink: 0;
        }

        .queue-item-title {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-grow: 1;
        }

        .remove-item-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
        }

        .remove-item-btn:hover {
          color: var(--error);
          background: rgba(239, 68, 68, 0.1);
        }

        .queue-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .clear-btn {
          padding: 10px 16px;
          font-size: 0.85rem;
        }

        .compare-now-btn {
          padding: 10px 20px;
          font-size: 0.85rem;
        }

        .disabled-link {
          opacity: 0.5;
          cursor: not-allowed;
          background: var(--bg-tertiary) !important;
          color: var(--text-muted) !important;
          border: 1px solid var(--border-color) !important;
          box-shadow: none !important;
        }

        @media (max-width: 992px) {
          .compare-queue-content {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          .queue-items {
            margin: 0;
          }
          .queue-actions {
            justify-content: flex-end;
          }
        }
      `}} />
    </div>
  );
}
