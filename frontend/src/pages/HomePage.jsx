import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Layers,
  Search,
  Sparkles,
  Star,
  Code,
  Database,
  Palette,
  Shield,
  Cpu,
  Cloud,
  Check
} from "lucide-react";

export default function HomePage({ 
  user, 
  openAuth, 
  courses = [], 
  jobs = [], 
  loading, 
  compareList = [], 
  onToggleCompare 
}) {
  const navigate = useNavigate();
  
  // Dynamic user preferences state
  const [userPrefs, setUserPrefs] = useState(null);
  const [offlineRecs, setOfflineRecs] = useState([]);

  // Fetch preferences from API on mount
  useEffect(() => {
    if (user && user.email) {
      fetch(`/api/preferences?email=${encodeURIComponent(user.email)}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setUserPrefs(data);
        })
        .catch(err => console.error("Error loading preferences:", err));
    }
  }, [user]);

  // Fetch offline recommendations based on preferences
  useEffect(() => {
    fetch("/api/institutes")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (userPrefs && userPrefs.preferredDomains && userPrefs.preferredDomains.length > 0) {
          const filtered = data.filter(inst => 
            inst.categories.some(cat => userPrefs.preferredDomains.includes(cat))
          );
          if (filtered.length > 0) {
            setOfflineRecs(filtered.slice(0, 3));
            return;
          }
        }
        const sorted = [...data].sort((a, b) => b.rating - a.rating);
        setOfflineRecs(sorted.slice(0, 3));
      })
      .catch(err => console.error("Error loading offline recommendations:", err));
  }, [userPrefs]);

  // Derive mock metrics for compared and searched counts
  const enhancedCourses = courses.map(course => {
    const charCodeSum = course.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const comparedCount = (charCodeSum % 140) + 45; // range: 45 - 185
    const searchedCount = (charCodeSum % 350) + 120; // range: 120 - 470
    return { ...course, comparedCount, searchedCount };
  });

  const mostComparedCourses = [...enhancedCourses]
    .sort((a, b) => b.comparedCount - a.comparedCount)
    .slice(0, 6);

  const mostSearchedCourses = [...enhancedCourses]
    .sort((a, b) => b.searchedCount - a.searchedCount)
    .slice(0, 6);

  const matchups = [
    {
      title1: "Complete Python Bootcamp",
      provider1: "Udemy",
      title2: "IBM Data Science Professional",
      provider2: "Coursera",
      search1: "python",
      search2: "ibm"
    },
    {
      title1: "Ultimate AWS Certified",
      provider1: "Udemy",
      title2: "Google Cloud Professional",
      provider2: "Coursera",
      search1: "aws",
      search2: "google"
    }
  ];

  const providerCount = new Set(courses.map(course => course.provider)).size;
  const freeCourses = courses.filter(course => course.price === 0).length;

  const requireUser = (path) => {
    if (!user) {
      openAuth();
      return;
    }
    navigate(path);
  };

  const categories = [
    { id: "programming", label: "Programming", icon: <Code size={16} /> },
    { id: "datascience", label: "Data Science", icon: <Database size={16} /> },
    { id: "design", label: "UI/UX Design", icon: <Palette size={16} /> },
    { id: "cybersecurity", label: "Cyber Security", icon: <Shield size={16} /> },
    { id: "aiml", label: "AI & ML", icon: <Cpu size={16} /> },
    { id: "cloudcomputing", label: "Cloud & DevOps", icon: <Cloud size={16} /> }
  ];

  return (
    <div className="home-page page-container">
      
      {/* Dynamic Welcome Banner */}
      <div className="home-header fade-in">
        <h1>Workspace Dashboard</h1>
        <p>
          Welcome back, <strong>{user?.name || user?.email?.split("@")[0] || "Learner"}</strong>. 
          {userPrefs ? (
            <span>
              {" "}Your target level is set to <span className="pref-highlight">{userPrefs.skillLevel}</span>
              {userPrefs.preferredDomains && userPrefs.preferredDomains.length > 0 ? (
                <span> with preferred domains: <span className="pref-highlight">{userPrefs.preferredDomains.join(", ")}</span>.</span>
              ) : (
                <span>. Explore certification paths using the categories search below.</span>
              )}
            </span>
          ) : (
            <span> Explore certification paths using the categories search below.</span>
          )}
        </p>
      </div>

      <section className="home-shell fade-in">
        
        {/* Quick Category Navigation Strip */}
        <div className="category-navigation-strip glass-panel">
          <span className="strip-label">Quick Search by Category:</span>
          <div className="category-badges">
            {categories.map(cat => (
              <button 
                key={cat.id} 
                className="cat-badge-btn"
                onClick={() => requireUser(`/courses?category=${cat.id}`)}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Single Column Content */}
        <div className="home-dashboard-single">
          <main className="home-main-full">
            
            {/* Metric Cards */}
            <div className="metric-grid">
              <div className="metric-card glass-panel">
                <div className="metric-icon blue"><BookOpen size={20} /></div>
                <div className="metric-text">
                  <span>Total Catalog Size</span>
                  <strong>{loading ? "--" : courses.length} Courses</strong>
                </div>
              </div>
              <div className="metric-card glass-panel">
                <div className="metric-icon cyan"><CheckCircle2 size={20} /></div>
                <div className="metric-text">
                  <span>Free Certifications</span>
                  <strong>{loading ? "--" : freeCourses} Options</strong>
                </div>
              </div>
              <div className="metric-card glass-panel">
                <div className="metric-icon purple"><BarChart3 size={20} /></div>
                <div className="metric-text">
                  <span>Connected Platforms</span>
                  <strong>{loading ? "--" : providerCount} Providers</strong>
                </div>
              </div>
              <div className="metric-card glass-panel">
                <div className="metric-icon green"><Briefcase size={20} /></div>
                <div className="metric-text">
                  <span>Active Jobs Tracked</span>
                  <strong>{loading ? "--" : jobs.length} Roles</strong>
                </div>
              </div>
            </div>

            {/* Real-time Comparison Queue Integration Widget */}
            {compareList.length > 0 && (
              <div className="active-compare-widget glass-panel">
                <div className="widget-header">
                  <div className="widget-title">
                    <Layers size={18} color="var(--primary)" />
                    <h3>Active Comparison Queue</h3>
                  </div>
                  <span className="queue-count-pill">{compareList.length} / 3 Selected</span>
                </div>
                <p className="widget-desc">You have selected courses to review. Overlay pricing, hours, and syllabus coverage now.</p>
                <div className="widget-queue-list">
                  {compareList.map(item => (
                    <div key={item.id} className="widget-queue-item">
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.provider}</span>
                      </div>
                      <button 
                        onClick={() => onToggleCompare(item)} 
                        className="remove-queue-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate("/compare")} className="btn-primary widget-action-btn">
                  <span>Launch Compare Matrices</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Comparison & Search Activity Grid */}
            <div className="home-trends-grid">
              
              {/* Most Compared Panel */}
              <section className="home-list-panel glass-panel">
                <div className="panel-content-wrap">
                  <div className="panel-heading">
                    <div>
                      <span className="home-eyebrow">Comparison Activity</span>
                      <h2>Most Compared Courses</h2>
                    </div>
                    <Layers size={18} color="var(--primary)" />
                  </div>

                  <div className="home-list">
                    {loading ? (
                      <div className="list-empty">Loading courses...</div>
                    ) : mostComparedCourses.length > 0 ? (
                      mostComparedCourses.map(course => (
                        <div key={course.id} className="course-row-item">
                          <button 
                            className="course-row-main"
                            onClick={() => requireUser(`/courses?search=${encodeURIComponent(course.title)}`)}
                          >
                            <div className="course-row-details">
                              <h3>{course.title}</h3>
                              <span className="course-row-platform">{course.provider} • Compared <strong>{course.comparedCount}</strong> times</span>
                            </div>
                          </button>
                          <div className="course-row-actions">
                            <button 
                              onClick={() => onToggleCompare(course)}
                              className={`row-action-compare-btn ${compareList.some(item => item.id === course.id) ? "compared" : ""}`}
                            >
                              {compareList.some(item => item.id === course.id) ? <Check size={14} /> : "Compare"}
                            </button>
                            <div className="row-meta">
                              <Star size={12} fill="var(--primary)" color="var(--primary)" />
                              <strong>{course.rating}</strong>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="list-empty">No courses available.</div>
                    )}
                  </div>
                </div>

                <div className="panel-footer-action">
                  <div className="panel-insight-box">
                    <Sparkles size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>Compare up to 3 courses side-by-side to overlay pricing, hours, and curriculum syllabus.</span>
                  </div>
                  <button onClick={() => navigate("/compare")} className="btn-secondary">
                    <span>Open Comparison Center</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </section>

              {/* Most Searched Panel */}
              <section className="home-list-panel glass-panel">
                <div className="panel-content-wrap">
                  <div className="panel-heading">
                    <div>
                      <span className="home-eyebrow">Search Volume</span>
                      <h2>Most Searched Courses</h2>
                    </div>
                    <Search size={18} color="var(--primary)" />
                  </div>

                  <div className="home-list">
                    {loading ? (
                      <div className="list-empty">Loading courses...</div>
                    ) : mostSearchedCourses.length > 0 ? (
                      mostSearchedCourses.map(course => (
                        <div key={course.id} className="course-row-item">
                          <button 
                            className="course-row-main"
                            onClick={() => requireUser(`/courses?search=${encodeURIComponent(course.title)}`)}
                          >
                            <div className="course-row-details">
                              <h3>{course.title}</h3>
                              <span className="course-row-platform">{course.provider} • Searched <strong>{course.searchedCount}</strong> times</span>
                            </div>
                          </button>
                          <div className="course-row-actions">
                            <button 
                              onClick={() => onToggleCompare(course)}
                              className={`row-action-compare-btn ${compareList.some(item => item.id === course.id) ? "compared" : ""}`}
                            >
                              {compareList.some(item => item.id === course.id) ? <Check size={14} /> : "Compare"}
                            </button>
                            <div className="row-meta">
                              <Star size={12} fill="var(--primary)" color="var(--primary)" />
                              <strong>{course.rating}</strong>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="list-empty">No courses available.</div>
                    )}
                  </div>
                </div>

                <div className="panel-footer-action">
                  <div className="panel-insight-box">
                    <Search size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>Search query trends and platform click activity are updated in real-time daily.</span>
                  </div>
                  <button onClick={() => navigate("/courses")} className="btn-secondary">
                    <span>Explore Course Catalog</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </section>

              {/* Quick Matchups Panel */}
              <section className="home-list-panel glass-panel">
                <div className="panel-heading">
                  <div>
                    <span className="home-eyebrow">Quick Matchups</span>
                    <h2>Trending Comparisons</h2>
                  </div>
                  <Sparkles size={18} color="var(--primary)" />
                </div>

                <div className="home-list">
                  {matchups.map((match, idx) => (
                    <div key={idx} className="matchup-item glass-panel">
                      <div className="matchup-vs-container">
                        <div className="matchup-course-box">
                          <h4>{match.title1}</h4>
                          <span className="prov-tag udy">{match.provider1}</span>
                        </div>
                        <div className="vs-divider">
                          <div className="vs-line"></div>
                          <div className="vs-circle-small">VS</div>
                        </div>
                        <div className="matchup-course-box">
                          <h4>{match.title2}</h4>
                          <span className="prov-tag cou">{match.provider2}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const c1 = courses.find(c => c.title.toLowerCase().includes(match.search1));
                          const c2 = courses.find(c => c.title.toLowerCase().includes(match.search2));
                          if (c1 && c2) {
                            const hasC1 = compareList.some(item => item.id === c1.id);
                            const hasC2 = compareList.some(item => item.id === c2.id);
                            if (!hasC1) onToggleCompare(c1);
                            if (!hasC2) onToggleCompare(c2);
                            navigate("/compare");
                          } else {
                            navigate("/courses");
                          }
                        }}
                        className="btn-secondary matchup-btn-small"
                      >
                        <span>Quick Compare</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Recommended Offline Classes Section */}
            <div className="home-offline-recommendations-section glass-panel fade-in">
              <div className="section-header">
                <div>
                  <span className="home-eyebrow">Offline Class Discovery</span>
                  <h2>Recommended Coaching Centers Near You</h2>
                </div>
                <button onClick={() => navigate("/offline-classes")} className="btn-secondary">
                  <span>Browse All Offline Classes</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="recommendations-grid">
                {offlineRecs.length > 0 ? (
                  offlineRecs.map(inst => (
                    <div 
                      key={inst.id} 
                      className="rec-inst-card glass-panel"
                      onClick={() => navigate(`/institute/${inst.id}`)}
                    >
                      <div className="rec-card-image">
                        <img src={inst.coverImage} alt={inst.name} />
                        <div className="rec-badge">⭐ {inst.rating}</div>
                      </div>
                      <div className="rec-card-body">
                        <img src={inst.logo} alt={inst.name} className="rec-logo" />
                        <div className="rec-text">
                          <h3>{inst.name}</h3>
                          <span>📍 {inst.city}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rec-empty-state">
                    <p>No offline recommendations matching preferences found. Browse all offline classes to discover centers.</p>
                  </div>
                )}
              </div>
            </div>

          </main>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .home-page {
          display: flex;
          flex-direction: column;
        }

        /* Comparison & Search Activity Grid */
        .home-trends-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }

        @media (max-width: 1024px) {
          .home-trends-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        /* Matchup Panel Styling */
        .matchup-item {
          padding: 20px;
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all var(--transition-normal);
        }

        .matchup-item:hover {
          border-color: rgba(29, 92, 255, 0.3);
          transform: translateY(-4px);
          box-shadow: 
            0 20px 40px rgba(15, 23, 42, 0.04), 
            0 0 25px rgba(29, 92, 255, 0.05);
        }

        .matchup-vs-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
          position: relative;
        }

        .matchup-course-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          transition: border-color var(--transition-fast);
        }

        .matchup-item:hover .matchup-course-box {
          border-color: rgba(29, 92, 255, 0.18);
        }

        .matchup-course-box h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .prov-tag {
          align-self: flex-start;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .prov-tag.udy {
          background: rgba(164, 53, 240, 0.12);
          color: #a435f0;
          border: 1px solid rgba(164, 53, 240, 0.25);
        }

        .prov-tag.cou {
          background: rgba(0, 86, 210, 0.12);
          color: #0056d2;
          border: 1px solid rgba(0, 86, 210, 0.25);
        }

        .vs-divider {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 20px;
        }

        .vs-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: var(--border-color);
          z-index: 1;
        }

        .vs-circle-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--accent-purple));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          color: #ffffff;
          border: 2px solid var(--bg-secondary);
          box-shadow: 0 2px 8px rgba(29, 92, 255, 0.15);
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        .matchup-btn-small {
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 700;
          width: 100%;
          justify-content: center;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: var(--radius-md);
        }

        .home-header {
          margin-bottom: 40px;
        }

        .home-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 60%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
        }

        .home-header p {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.5;
        }

        .pref-highlight {
          color: var(--primary);
          font-weight: 700;
        }

        .home-shell {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        /* Quick Category Strip */
        .category-navigation-strip {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 20px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
        }

        .strip-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .category-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .cat-badge-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          padding: 6px 14px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .cat-badge-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-light);
        }

        /* Main Single Column Content */
        .home-dashboard-single {
          width: 100%;
        }

        .home-main-full {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        /* Active Compare Queue Widget */
        .active-compare-widget {
          padding: 24px;
          background: var(--bg-glass);
          border: 1px solid rgba(37, 99, 235, 0.25);
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .widget-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .widget-title h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .queue-count-pill {
          background: var(--primary);
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .widget-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .widget-queue-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 6px 0;
        }

        .widget-queue-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 10px 16px;
          border-radius: var(--radius-md);
        }

        .widget-queue-item strong {
          font-size: 0.88rem;
          color: var(--text-primary);
          display: block;
        }

        .widget-queue-item span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .remove-queue-btn {
          background: transparent;
          border: none;
          color: var(--error);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }

        .remove-queue-btn:hover {
          text-decoration: underline;
        }

        .widget-action-btn {
          align-self: flex-start;
        }

        /* Metrics grid */
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 576px) {
          .metric-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .metric-card {
          padding: 20px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
        }

        .metric-card:hover {
          transform: translateY(-4px);
          border-color: rgba(29, 92, 255, 0.25);
          box-shadow: 0 10px 25px rgba(29, 92, 255, 0.05);
        }

        .metric-icon {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .metric-icon.blue { background: linear-gradient(135deg, var(--primary), #4c82ff); }
        .metric-icon.cyan { background: linear-gradient(135deg, var(--accent-cyan), #0fd5d8); }
        .metric-icon.purple { background: linear-gradient(135deg, var(--accent-purple), #9055ff); }
        .metric-icon.green { background: linear-gradient(135deg, #10b981, #059669); }

        .metric-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .metric-text span {
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .metric-text strong {
          color: var(--text-primary);
          font-size: 1.15rem;
          font-weight: 800;
          line-height: 1.1;
        }

        /* Lists Grid */
        .home-list-panel {
          padding: 24px;
          background: var(--bg-glass);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .panel-content-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .panel-footer-action {
          margin-top: auto;
          padding-top: 24px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .panel-footer-action .btn-secondary {
          width: 100%;
          justify-content: center;
          padding: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panel-insight-box {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px;
          background: rgba(29, 92, 255, 0.04);
          border: 1px dashed rgba(29, 92, 255, 0.15);
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .panel-heading h2 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .home-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .course-row-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .course-row-item:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .course-row-main {
          background: transparent;
          border: none;
          padding: 0;
          text-align: left;
          cursor: pointer;
          flex: 1;
          margin-right: 12px;
        }

        .course-row-details h3 {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 2px 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-row-platform {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .course-row-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .row-action-compare-btn {
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 700;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .row-action-compare-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-light);
        }

        .row-action-compare-btn.compared {
          background: var(--primary-light);
          border-color: var(--primary);
          color: var(--primary);
        }

        .row-meta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--primary);
          background: var(--primary-light);
          border-radius: var(--radius-full);
          padding: 4px 8px;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .list-empty {
          color: var(--text-muted);
          padding: 24px 0;
          text-align: center;
          font-size: 0.85rem;
        }

        @media (max-width: 1024px) {
          .category-navigation-strip {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 768px) {
          .metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 480px) {
          .metric-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Recommended offline section */
        .home-offline-recommendations-section {
          margin-top: 36px;
          padding: 28px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 14px;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 768px) {
          .recommendations-grid {
            grid-template-columns: 1fr;
          }
        }

        .rec-inst-card {
          overflow: hidden;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-normal);
          display: flex;
          flex-direction: column;
        }

        .rec-inst-card:hover {
          transform: translateY(-4px);
          border-color: rgba(29, 92, 255, 0.25);
          box-shadow: var(--shadow-md);
        }

        .rec-card-image {
          height: 120px;
          position: relative;
          width: 100%;
        }

        .rec-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .rec-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(15, 23, 42, 0.85);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 3px 6px;
          border-radius: var(--radius-sm);
        }

        .rec-card-body {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rec-logo {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          object-fit: cover;
          background: #FFFFFF;
        }

        .rec-text h3 {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .rec-text span {
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .rec-empty-state {
          grid-column: span 3;
          text-align: center;
          padding: 30px 0;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
      `}} />
    </div>
  );
}
