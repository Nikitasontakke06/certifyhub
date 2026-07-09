import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  X,
  Plus,
  Compass,
  Star,
  MapPin,
  Check,
  X as XMark,
  Award,
  BookOpen,
  DollarSign,
  Phone,
  ArrowRight
} from "lucide-react";

export default function OfflineComparePage({ compareList = [], onToggleCompare, openAuth }) {
  const navigate = useNavigate();

  const handleRemove = (inst, e) => {
    e.preventDefault();
    onToggleCompare(inst);
  };

  return (
    <div className="offline-compare-page page-container">
      
      <div className="compare-header fade-in">
        <h1>Coaching Compare Center</h1>
        <p>Analyze and compare nearby offline coaching institutes side-by-side to choose the best physical classroom option for your career.</p>
      </div>

      {compareList.length > 0 ? (
        <div className="compare-workspace fade-in">
          
          <div className="compare-table-wrapper glass-panel">
            <table className="compare-matrix">
              <thead>
                <tr>
                  <th className="feature-label-col">Comparison Criteria</th>
                  {compareList.map(inst => (
                    <th key={inst.id} className="institute-column-header">
                      <button 
                        onClick={(e) => handleRemove(inst, e)} 
                        className="remove-column-btn"
                        title="Remove from comparison"
                      >
                        <X size={14} />
                      </button>
                      <div className="header-inst-card">
                        <img src={inst.logo} alt={inst.name} className="inst-logo" />
                        <h3>{inst.name}</h3>
                        <span>{inst.city}, {inst.state}</span>
                      </div>
                    </th>
                  ))}
                  {compareList.length < 3 && (
                    <th className="add-more-column">
                      <div className="add-more-box" onClick={() => navigate("/offline-classes")}>
                        <Plus size={24} color="var(--primary)" />
                        <span>Add Institute</span>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* 1. Rating */}
                <tr>
                  <td className="row-title">Average Rating</td>
                  {compareList.map(inst => (
                    <td key={inst.id}>
                      <div className="rating-cell">
                        <Star size={16} fill="var(--primary)" color="var(--primary)" />
                        <strong>{inst.rating}</strong>
                        <span>({inst.reviewsCount} reviews)</span>
                      </div>
                    </td>
                  ))}
                  {compareList.length < 3 && <td></td>}
                </tr>

                {/* 2. Established */}
                <tr>
                  <td className="row-title">Year Established</td>
                  {compareList.map(inst => (
                    <td key={inst.id}>
                      <span className="info-val">Classroom since {inst.establishedYear}</span>
                    </td>
                  ))}
                  {compareList.length < 3 && <td></td>}
                </tr>

                {/* 3. Fees range */}
                <tr>
                  <td className="row-title">Fees Range</td>
                  {compareList.map(inst => {
                    const fees = inst.courses.map(c => c.fees);
                    const min = Math.min(...fees);
                    const max = Math.max(...fees);
                    return (
                      <td key={inst.id}>
                        <div className="fees-cell">
                          <strong>₹{min.toLocaleString("en-IN")} - ₹{max.toLocaleString("en-IN")}</strong>
                          <span>({inst.courses.length} courses)</span>
                        </div>
                      </td>
                    );
                  })}
                  {compareList.length < 3 && <td></td>}
                </tr>

                {/* 4. Placement assistance */}
                <tr>
                  <td className="row-title">Placement Record</td>
                  {compareList.map(inst => (
                    <td key={inst.id}>
                      <div className="placement-cell">
                        <Award size={16} color="var(--accent-cyan)" />
                        <span>{inst.placementRecord || "Placement assistance offered"}</span>
                      </div>
                    </td>
                  ))}
                  {compareList.length < 3 && <td></td>}
                </tr>

                {/* 5. Practical Labs */}
                <tr>
                  <td className="row-title">Practical Coding Labs</td>
                  {compareList.map(inst => (
                    <td key={inst.id}>
                      {inst.practicalLabs ? (
                        <div className="status-badge yes">
                          <Check size={14} />
                          <span>Equipped Labs</span>
                        </div>
                      ) : (
                        <div className="status-badge no">
                          <XMark size={14} />
                          <span>No Labs</span>
                        </div>
                      )}
                    </td>
                  ))}
                  {compareList.length < 3 && <td></td>}
                </tr>

                {/* 6. Facilities */}
                <tr>
                  <td className="row-title">Infrastructure Facilities</td>
                  {compareList.map(inst => (
                    <td key={inst.id}>
                      <ul className="facilities-list-compare">
                        {inst.infrastructure.map((fac, i) => (
                          <li key={i}>{fac}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {compareList.length < 3 && <td></td>}
                </tr>

                {/* 7. Contacts */}
                <tr>
                  <td className="row-title">Contact & Help</td>
                  {compareList.map(inst => (
                    <td key={inst.id}>
                      <div className="contacts-cell">
                        <span className="contact-line">📞 {inst.phone}</span>
                        <span className="contact-line">✉️ {inst.email}</span>
                      </div>
                    </td>
                  ))}
                  {compareList.length < 3 && <td></td>}
                </tr>

                {/* 8. Action row */}
                <tr className="actions-compare-row">
                  <td className="row-title">Actions</td>
                  {compareList.map(inst => (
                    <td key={inst.id}>
                      <div className="action-cell">
                        <Link to={`/institute/${inst.id}`} className="btn-primary w-full text-center">
                          <span>View Profile</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </td>
                  ))}
                  {compareList.length < 3 && <td></td>}
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      ) : (
        <div className="compare-empty-state glass-panel text-center fade-in">
          <Compass size={48} color="var(--text-muted)" />
          <h2>Compare List is Empty</h2>
          <p>Go to the Offline Classes discovery page and click the "Compare" button on multiple coaching profiles to compare details side-by-side.</p>
          <button onClick={() => navigate("/offline-classes")} className="btn-primary">Browse Classes</button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .offline-compare-page {
          display: flex;
          flex-direction: column;
        }

        .compare-header {
          margin-bottom: 40px;
        }

        .compare-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 60%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
        }

        .compare-header p {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.5;
          max-width: 600px;
        }

        /* Compare Matrix */
        .compare-table-wrapper {
          overflow-x: auto;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
        }

        .compare-matrix {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .compare-matrix th, .compare-matrix td {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          vertical-align: top;
          min-width: 250px;
        }

        .compare-matrix th {
          background: rgba(255, 255, 255, 0.4);
        }

        .feature-label-col {
          font-weight: 800;
          color: var(--text-primary);
          text-transform: uppercase;
          font-size: 0.78rem;
          letter-spacing: 0.05em;
          vertical-align: middle !important;
          min-width: 200px !important;
          border-right: 1px solid var(--border-color);
        }

        .institute-column-header {
          position: relative;
          text-align: center;
          border-right: 1px solid var(--border-color);
        }

        .remove-column-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .remove-column-btn:hover {
          background: var(--error);
          color: #FFFFFF;
          border-color: var(--error);
        }

        .header-inst-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .inst-logo {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          object-fit: cover;
          background: #FFFFFF;
        }

        .header-inst-card h3 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .header-inst-card span {
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .add-more-column {
          vertical-align: middle !important;
          text-align: center;
        }

        .add-more-box {
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-md);
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .add-more-box:hover {
          border-color: var(--primary);
          background: var(--primary-light);
        }

        .add-more-box span {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
        }

        /* Cells */
        .compare-matrix td {
          border-right: 1px solid var(--border-color);
        }

        .row-title {
          font-weight: 700;
          color: var(--text-secondary);
          font-size: 0.85rem;
          border-right: 1px solid var(--border-color);
        }

        .rating-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
        }

        .rating-cell strong {
          color: var(--text-primary);
        }

        .rating-cell span {
          color: var(--text-muted);
        }

        .info-val {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .fees-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .fees-cell strong {
          font-size: 1rem;
          color: var(--primary);
        }

        .fees-cell span {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .placement-cell {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
          line-height: 1.4;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .status-badge.yes {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .status-badge.no {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .facilities-list-compare {
          padding-left: 16px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .contacts-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .action-cell {
          display: flex;
        }

        .actions-compare-row td {
          border-bottom: none;
        }

        /* Empty state */
        .compare-empty-state {
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: var(--text-secondary);
        }

        .compare-empty-state h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .compare-empty-state p {
          max-width: 500px;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }
      `}} />
    </div>
  );
}
