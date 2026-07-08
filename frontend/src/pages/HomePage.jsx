import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Compass,
  IndianRupee,
  Layers,
  Search,
  Sparkles,
  Star,
  TrendingUp
} from "lucide-react";

export default function HomePage({ user, openAuth, courses = [], jobs = [], loading }) {
  const navigate = useNavigate();
  const topCourses = [...courses]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);
  const trendingJobs = [...jobs]
    .sort((a, b) => (b.dailyGrowthRate || 0) - (a.dailyGrowthRate || 0))
    .slice(0, 4);
  const providerCount = new Set(courses.map(course => course.provider)).size;
  const freeCourses = courses.filter(course => course.price === 0).length;

  const requireUser = (path) => {
    if (!user) {
      openAuth();
      return;
    }
    navigate(path);
  };

  return (
    <div className="home-page page-container">
      <section className="home-shell fade-in">
        <div className="home-topbar">
          <div>
            <span className="home-eyebrow">Workspace</span>
            <h1>{user ? `Welcome back, ${user.name || user.email}` : "CertifyHub Home"}</h1>
          </div>
          <button className="btn-primary home-primary-action" onClick={() => requireUser("/courses")}>
            <Search size={16} />
            <span>Find Courses</span>
          </button>
        </div>

        <div className="home-dashboard">
          <aside className="home-sidebar glass-panel">
            <button className="home-nav-item active" onClick={() => requireUser("/courses")}>
              <Compass size={18} />
              <span>Discover</span>
            </button>
            <button className="home-nav-item" onClick={() => requireUser("/compare")}>
              <Layers size={18} />
              <span>Compare</span>
            </button>
            <button className="home-nav-item" onClick={() => requireUser("/jobs")}>
              <Briefcase size={18} />
              <span>Career Trends</span>
            </button>
            <button className="home-nav-item" onClick={() => requireUser("/profile")}>
              <Sparkles size={18} />
              <span>Profile Match</span>
            </button>
          </aside>

          <main className="home-main">
            <div className="metric-grid">
              <div className="metric-card glass-panel">
                <div className="metric-icon blue"><BookOpen size={20} /></div>
                <span>Total Courses</span>
                <strong>{loading ? "--" : courses.length}</strong>
              </div>
              <div className="metric-card glass-panel">
                <div className="metric-icon cyan"><CheckCircle2 size={20} /></div>
                <span>Free Options</span>
                <strong>{loading ? "--" : freeCourses}</strong>
              </div>
              <div className="metric-card glass-panel">
                <div className="metric-icon purple"><BarChart3 size={20} /></div>
                <span>Platforms</span>
                <strong>{loading ? "--" : providerCount}</strong>
              </div>
              <div className="metric-card glass-panel">
                <div className="metric-icon green"><Briefcase size={20} /></div>
                <span>Career Tracks</span>
                <strong>{loading ? "--" : jobs.length}</strong>
              </div>
            </div>

            <section className="command-panel glass-panel">
              <div className="command-copy">
                <span className="home-eyebrow">Next best action</span>
                <h2>Build a short list before you commit.</h2>
                <p>Open the course catalog, compare up to three options, then check which skills map to active job demand.</p>
              </div>
              <div className="command-actions">
                <button onClick={() => requireUser("/courses")} className="btn-primary">
                  <span>Browse Catalog</span>
                  <ArrowRight size={16} />
                </button>
                <button onClick={() => requireUser("/jobs")} className="btn-secondary">
                  <TrendingUp size={16} />
                  <span>View Jobs</span>
                </button>
              </div>
            </section>

            <div className="home-content-grid">
              <section className="home-list-panel glass-panel">
                <div className="panel-heading">
                  <div>
                    <span className="home-eyebrow">Top rated</span>
                    <h2>Courses to review</h2>
                  </div>
                  <Link to="/courses" className="panel-link">All courses</Link>
                </div>

                <div className="home-list">
                  {loading ? (
                    <div className="list-empty">Loading course data...</div>
                  ) : topCourses.length > 0 ? (
                    topCourses.map(course => (
                      <button key={course.id} className="course-row" onClick={() => requireUser(`/courses?search=${encodeURIComponent(course.title)}`)}>
                        <div>
                          <h3>{course.title}</h3>
                          <span>{course.provider}</span>
                        </div>
                        <div className="row-meta">
                          <Star size={14} fill="var(--primary)" color="var(--primary)" />
                          <strong>{course.rating}</strong>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="list-empty">No courses loaded yet.</div>
                  )}
                </div>
              </section>

              <section className="home-list-panel glass-panel">
                <div className="panel-heading">
                  <div>
                    <span className="home-eyebrow">Demand signal</span>
                    <h2>Career movement</h2>
                  </div>
                  <Link to="/jobs" className="panel-link">All jobs</Link>
                </div>

                <div className="home-list">
                  {loading ? (
                    <div className="list-empty">Loading job trends...</div>
                  ) : trendingJobs.length > 0 ? (
                    trendingJobs.map(job => (
                      <button key={job.id} className="job-row" onClick={() => requireUser("/jobs")}>
                        <div>
                          <h3>{job.title}</h3>
                          <span>{job.skills.slice(0, 3).join(" / ")}</span>
                        </div>
                        <div className="growth-pill">
                          <TrendingUp size={14} />
                          <strong>{Math.abs(job.dailyGrowthRate || 0)}%</strong>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="list-empty">No job trends loaded yet.</div>
                  )}
                </div>
              </section>
            </div>

            <section className="home-insights glass-panel">
              <div className="insight-item">
                <IndianRupee size={18} />
                <span>Compare Indian pricing before enrolling.</span>
              </div>
              <div className="insight-item">
                <CheckCircle2 size={18} />
                <span>Use profile preferences to improve recommendations.</span>
              </div>
              <div className="insight-item">
                <Briefcase size={18} />
                <span>Validate each learning path against active demand.</span>
              </div>
            </section>
          </main>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .home-page {
          padding-top: 118px;
        }

        .home-shell {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .home-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .home-eyebrow {
          display: inline-block;
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .home-topbar h1 {
          color: var(--text-primary);
          font-size: 2.3rem;
          line-height: 1.15;
        }

        .home-primary-action {
          flex-shrink: 0;
        }

        .home-dashboard {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        .home-sidebar {
          position: sticky;
          top: 106px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
        }

        .home-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          padding: 11px 12px;
          font-size: 0.9rem;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .home-nav-item:hover,
        .home-nav-item.active {
          color: var(--primary);
          background: var(--primary-light);
          border-color: rgba(29, 92, 255, 0.16);
        }

        .home-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-width: 0;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .metric-card {
          padding: 18px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 6px 12px;
          align-items: center;
        }

        .metric-card span {
          color: var(--text-secondary);
          font-size: 0.82rem;
          font-weight: 700;
        }

        .metric-card strong {
          grid-column: 2;
          color: var(--text-primary);
          font-size: 1.8rem;
          line-height: 1;
        }

        .metric-icon {
          grid-row: span 2;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .metric-icon.blue { background: linear-gradient(135deg, var(--primary), #4483ff); }
        .metric-icon.cyan { background: linear-gradient(135deg, var(--accent-cyan), #06b6d4); }
        .metric-icon.purple { background: linear-gradient(135deg, var(--accent-purple), #a855f7); }
        .metric-icon.green { background: linear-gradient(135deg, #10b981, #059669); }

        .command-panel {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: center;
          padding: 28px;
          background:
            linear-gradient(135deg, rgba(29, 92, 255, 0.12), rgba(9, 168, 216, 0.08)),
            var(--bg-glass);
        }

        .command-copy h2,
        .panel-heading h2 {
          color: var(--text-primary);
          font-size: 1.35rem;
          margin-bottom: 4px;
        }

        .command-copy p {
          color: var(--text-secondary);
          max-width: 620px;
        }

        .command-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: flex-end;
        }

        .home-content-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }

        .home-list-panel {
          padding: 22px;
          min-width: 0;
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
        }

        .panel-link {
          color: var(--primary);
          font-size: 0.82rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .home-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .course-row,
        .job-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
          padding: 14px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.68);
          cursor: pointer;
          text-align: left;
          transition: all var(--transition-fast);
        }

        .course-row:hover,
        .job-row:hover {
          border-color: var(--border-color-hover);
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.92);
        }

        .course-row h3,
        .job-row h3 {
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 800;
          margin-bottom: 2px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-row span,
        .job-row span {
          color: var(--text-secondary);
          font-size: 0.8rem;
        }

        .row-meta,
        .growth-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--primary);
          background: var(--primary-light);
          border-radius: var(--radius-full);
          padding: 5px 8px;
          font-size: 0.8rem;
          flex-shrink: 0;
        }

        .growth-pill {
          color: #059669;
          background: rgba(16, 185, 129, 0.12);
        }

        .list-empty {
          color: var(--text-secondary);
          padding: 20px 0;
          text-align: center;
        }

        .home-insights {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          padding: 18px;
        }

        .insight-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 700;
        }

        .insight-item svg {
          color: var(--primary);
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .home-dashboard {
            grid-template-columns: 1fr;
          }
          .home-sidebar {
            position: static;
            flex-direction: row;
            overflow-x: auto;
          }
          .home-nav-item {
            min-width: 160px;
          }
          .metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .home-topbar,
          .command-panel {
            align-items: stretch;
            flex-direction: column;
          }
          .home-topbar h1 {
            font-size: 1.9rem;
          }
          .metric-grid,
          .home-content-grid,
          .home-insights {
            grid-template-columns: 1fr;
          }
          .command-actions {
            justify-content: stretch;
          }
          .command-actions > button {
            justify-content: center;
          }
        }
      `}} />
    </div>
  );
}
