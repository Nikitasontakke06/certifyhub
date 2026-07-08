import React, { useState, useEffect } from "react";
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
  TrendingUp,
  Award,
  Activity,
  DollarSign,
  LineChart,
  Settings,
  HelpCircle,
  ShieldAlert
} from "lucide-react";

export default function HomePage({ user, openAuth, courses = [], jobs = [], loading }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "analytics" | "matcher"
  
  // States for interactive Analytics tab
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // States for interactive Skill Matcher tab
  const [targetRole, setTargetRole] = useState("Fullstack Developer");
  const [userExperience, setUserExperience] = useState("Beginner");

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

  // Get course categories
  const categories = Array.from(new Set(courses.map(c => c.category)));

  // Analytics stats helper
  const getCategoryStats = () => {
    const filtered = selectedCategory === "all" 
      ? courses 
      : courses.filter(c => c.category === selectedCategory);
    
    if (filtered.length === 0) return { avgPrice: 0, topRated: "N/A", avgRating: 0 };
    
    const totalVal = filtered.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const avgPrice = Math.round(totalVal / filtered.length);
    const sortedByRating = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const topRated = sortedByRating[0]?.title || "N/A";
    const avgRating = (filtered.reduce((acc, curr) => acc + (curr.rating || 0), 0) / filtered.length).toFixed(1);
    
    return { avgPrice, topRated, avgRating, count: filtered.length };
  };

  const catStats = getCategoryStats();

  // Matcher calculations
  const calculateMatch = () => {
    // Basic mock calculation based on selected inputs
    let matchScore = 75;
    if (targetRole === "Data Scientist" && userExperience === "Intermediate") matchScore = 92;
    else if (targetRole === "Fullstack Developer" && userExperience === "Beginner") matchScore = 88;
    else if (targetRole === "AI Engineer" && userExperience === "Advanced") matchScore = 95;
    else if (targetRole === "UI/UX Designer") matchScore = 84;
    
    // Find courses mapping to role keywords
    const keywords = targetRole.toLowerCase().split(" ");
    const matchedCourses = courses.filter(c => 
      keywords.some(kw => c.title.toLowerCase().includes(kw) || c.category.toLowerCase().includes(kw))
    ).slice(0, 3);

    return { matchScore, matchedCourses };
  };

  const matchData = calculateMatch();

  return (
    <div className="home-page page-container">
      <section className="home-shell fade-in">
        
        {/* Dynamic Premium Header */}
        <div className="home-topbar-wrapper glass-panel">
          <div className="home-topbar-info">
            <span className="home-eyebrow-badge">
              <Activity size={12} />
              <span>Workspace Active</span>
            </span>
            <h1>Welcome back, <span className="gradient-text">{user?.name || user?.email?.split("@")[0] || "Learner"}</span></h1>
            <p className="home-subtitle">Analyze, compare, and match certifications against active Indian market demand.</p>
          </div>
          <div className="home-topbar-actions">
            <button className="btn-secondary" onClick={() => requireUser("/profile")}>
              <Settings size={16} />
              <span>Preferences</span>
            </button>
            <button className="btn-primary" onClick={() => requireUser("/courses")}>
              <Search size={16} />
              <span>Explore Courses</span>
            </button>
          </div>
        </div>

        {/* Dashboard 3-Column Layout */}
        <div className="home-dashboard">
          
          {/* Sidebar Nav */}
          <aside className="home-sidebar glass-panel">
            <div className="sidebar-group">
              <span className="sidebar-group-title">Menu</span>
              <button 
                className={`home-nav-item ${activeTab === "overview" ? "active" : ""}`} 
                onClick={() => setActiveTab("overview")}
              >
                <Compass size={18} />
                <span>Overview</span>
              </button>
              <button 
                className={`home-nav-item ${activeTab === "analytics" ? "active" : ""}`} 
                onClick={() => setActiveTab("analytics")}
              >
                <LineChart size={18} />
                <span>Market Analytics</span>
              </button>
              <button 
                className={`home-nav-item ${activeTab === "matcher" ? "active" : ""}`} 
                onClick={() => setActiveTab("matcher")}
              >
                <Sparkles size={18} />
                <span>Profile Matcher</span>
              </button>
            </div>
            
            <div className="sidebar-divider"></div>
            
            <div className="sidebar-group">
              <span className="sidebar-group-title">Tools</span>
              <button className="home-nav-item" onClick={() => requireUser("/compare")}>
                <Layers size={18} />
                <span>Comparison Center</span>
              </button>
              <button className="home-nav-item" onClick={() => requireUser("/jobs")}>
                <Briefcase size={18} />
                <span>Career Tracks</span>
              </button>
            </div>
            
            {/* Quick Helper Widget */}
            <div className="sidebar-helper-card">
              <HelpCircle size={20} color="var(--primary)" />
              <h4>Need Advice?</h4>
              <p>Try comparing certifications side-by-side to find the lowest pricing options.</p>
            </div>
          </aside>

          {/* Main Workspace Content Area */}
          <main className="home-main">
            
            {activeTab === "overview" && (
              <div className="tab-pane fade-in">
                
                {/* Metric Dashboard */}
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

                {/* SVG Premium Interactive Chart Mock */}
                <section className="chart-section glass-panel">
                  <div className="chart-header">
                    <div>
                      <span className="home-eyebrow">Interactive Insights</span>
                      <h2>Skills Demand vs Course Costs</h2>
                    </div>
                    <span className="chart-badge">Live Index</span>
                  </div>
                  <div className="chart-body">
                    {/* SVG Graphic represent mock interactive index chart */}
                    <svg viewBox="0 0 800 220" className="dashboard-svg-chart">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>
                      <grid stroke="var(--border-color)" strokeWidth="0.5" />
                      <line x1="50" y1="20" x2="50" y2="180" stroke="var(--border-color)" strokeWidth="1" />
                      <line x1="50" y1="180" x2="780" y2="180" stroke="var(--border-color)" strokeWidth="1" />
                      
                      {/* Grid Horizontal Guidelines */}
                      <line x1="50" y1="60" x2="780" y2="60" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="0.5" />
                      <line x1="50" y1="120" x2="780" y2="120" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="0.5" />

                      {/* Area Fill */}
                      <path d="M 50 180 L 150 130 L 250 145 L 350 80 L 450 110 L 550 50 L 650 75 L 750 30 L 750 180 Z" fill="url(#chartGrad)" />
                      
                      {/* Trend Line */}
                      <path d="M 50 180 L 150 130 L 250 145 L 350 80 L 450 110 L 550 50 L 650 75 L 750 30" 
                            fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
                      
                      {/* Data Points */}
                      <circle cx="150" cy="130" r="5" fill="var(--primary)" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="350" cy="80" r="5" fill="var(--primary)" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="550" cy="50" r="5" fill="var(--primary)" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="750" cy="30" r="5" fill="var(--primary)" stroke="#fff" strokeWidth="1.5" />

                      {/* Labels */}
                      <text x="150" y="200" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Jan</text>
                      <text x="350" y="200" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Mar</text>
                      <text x="550" y="200" textAnchor="middle" fontSize="10" fill="var(--text-muted)">May</text>
                      <text x="750" y="200" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Jul</text>
                      
                      <text x="40" y="65" textAnchor="end" fontSize="9" fill="var(--text-muted)">50% Demand</text>
                      <text x="40" y="125" textAnchor="end" fontSize="9" fill="var(--text-muted)">25% Demand</text>
                    </svg>
                  </div>
                  <div className="chart-footer">
                    <p>💡 <strong>Analysis:</strong> Certification categories in AI & Machine Learning saw a 34% hiring growth rate in India last month.</p>
                  </div>
                </section>

                {/* Dashboard Lists Grid */}
                <div className="home-content-grid">
                  
                  {/* Top Rated Courses Panel */}
                  <section className="home-list-panel glass-panel">
                    <div className="panel-heading">
                      <div>
                        <span className="home-eyebrow">Top Recommendations</span>
                        <h2>High Rated Syllabus</h2>
                      </div>
                      <Link to="/courses" className="panel-link">All Courses</Link>
                    </div>

                    <div className="home-list">
                      {loading ? (
                        <div className="list-empty">Loading courses...</div>
                      ) : topCourses.length > 0 ? (
                        topCourses.map(course => (
                          <button 
                            key={course.id} 
                            className="course-row" 
                            onClick={() => requireUser(`/courses?search=${encodeURIComponent(course.title)}`)}
                          >
                            <div className="course-row-details">
                              <h3>{course.title}</h3>
                              <span className="course-row-platform">{course.provider}</span>
                            </div>
                            <div className="row-meta">
                              <Star size={12} fill="var(--primary)" color="var(--primary)" />
                              <strong>{course.rating}</strong>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="list-empty">No courses available.</div>
                      )}
                    </div>
                  </section>

                  {/* Career Demand signal panel */}
                  <section className="home-list-panel glass-panel">
                    <div className="panel-heading">
                      <div>
                        <span className="home-eyebrow">Hiring Movement</span>
                        <h2>Hot Job Roles (India)</h2>
                      </div>
                      <Link to="/jobs" className="panel-link">All Jobs</Link>
                    </div>

                    <div className="home-list">
                      {loading ? (
                        <div className="list-empty">Loading jobs...</div>
                      ) : trendingJobs.length > 0 ? (
                        trendingJobs.map(job => (
                          <button 
                            key={job.id} 
                            className="job-row" 
                            onClick={() => requireUser("/jobs")}
                          >
                            <div className="job-row-details">
                              <h3>{job.title}</h3>
                              <span className="job-row-skills">{job.skills.slice(0, 2).join(" • ")}</span>
                            </div>
                            <div className="growth-pill">
                              <TrendingUp size={12} />
                              <strong>{Math.abs(job.dailyGrowthRate || 0)}%</strong>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="list-empty">No job data available.</div>
                      )}
                    </div>
                  </section>

                </div>

              </div>
            )}

            {activeTab === "analytics" && (
              <div className="tab-pane fade-in">
                <section className="analytics-explorer glass-panel">
                  <div className="panel-header-action">
                    <div>
                      <h2>Market Pricing & Platform Analytics</h2>
                      <p>Filter certification directories to compare costs and provider distribution.</p>
                    </div>
                    
                    {/* Interactive Filter Category */}
                    <div className="analytics-filter">
                      <label htmlFor="catSelect">Domain:</label>
                      <select 
                        id="catSelect" 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="form-select"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Interactive Stats Report */}
                  <div className="analytics-report-grid">
                    <div className="report-card">
                      <h3>Average Price</h3>
                      <span className="stat-value">₹{catStats.avgPrice}</span>
                      <p className="stat-desc">Calculated across this category's providers.</p>
                    </div>
                    <div className="report-card">
                      <h3>Average Rating</h3>
                      <span className="stat-value">⭐ {catStats.avgRating} / 5.0</span>
                      <p className="stat-desc">Based on aggregated learner evaluations.</p>
                    </div>
                    <div className="report-card">
                      <h3>Available Courses</h3>
                      <span className="stat-value">{catStats.count} Options</span>
                      <p className="stat-desc">Active items in our workspace.</p>
                    </div>
                  </div>

                  <div className="featured-analytics-highlight">
                    <Award size={20} color="var(--primary)" />
                    <div>
                      <h4>Top Performing Course in Selected Filter</h4>
                      <p className="highlight-title">{catStats.topRated}</p>
                    </div>
                  </div>

                  {/* Provider Pricing Comparison Graph Mock */}
                  <div className="provider-pricing-bar-chart">
                    <h4>Approximate Price Range by Provider (INR)</h4>
                    <div className="bar-chart-container">
                      <div className="bar-row">
                        <span className="bar-label">Udemy</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: "35%", background: "linear-gradient(90deg, var(--primary-light), var(--primary))" }}></div>
                        </div>
                        <span className="bar-val">₹389 - ₹3,499</span>
                      </div>
                      <div className="bar-row">
                        <span className="bar-label">Coursera</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: "65%", background: "linear-gradient(90deg, var(--primary-light), var(--primary))" }}></div>
                        </div>
                        <span className="bar-val">₹2,200 - ₹5,900</span>
                      </div>
                      <div className="bar-row">
                        <span className="bar-label">Swayam</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: "10%", background: "#10b981" }}></div>
                        </div>
                        <span className="bar-val">Free (Audit)</span>
                      </div>
                      <div className="bar-row">
                        <span className="bar-label">Great Learning</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: "80%", background: "linear-gradient(90deg, var(--primary-light), var(--primary))" }}></div>
                        </div>
                        <span className="bar-val">₹4,500 - ₹12,000</span>
                      </div>
                    </div>
                  </div>

                </section>
              </div>
            )}

            {activeTab === "matcher" && (
              <div className="tab-pane fade-in">
                <section className="matcher-workspace glass-panel">
                  <h2>Syllabus & Career Profile Matcher</h2>
                  <p className="matcher-intro">Select your target career path and skill level to discover your profile fit match.</p>

                  <div className="matcher-form">
                    <div className="form-group">
                      <label>Target Role:</label>
                      <select 
                        value={targetRole} 
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="form-select"
                      >
                        <option value="Fullstack Developer">Fullstack Developer</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="AI Engineer">AI & ML Engineer</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Your Current Level:</label>
                      <div className="experience-selector">
                        {["Beginner", "Intermediate", "Advanced"].map(lvl => (
                          <button 
                            key={lvl}
                            className={`exp-btn ${userExperience === lvl ? "active" : ""}`}
                            onClick={() => setUserExperience(lvl)}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Match Results Display */}
                  <div className="matcher-results">
                    <div className="match-score-radial">
                      <div className="radial-circle">
                        <span className="radial-score">{matchData.matchScore}%</span>
                        <span className="radial-label">Profile Fit</span>
                      </div>
                      <div className="radial-explanation">
                        <h4>Strong match!</h4>
                        <p>Based on your selected experience level and active hiring competencies in India for <strong>{targetRole}</strong>.</p>
                      </div>
                    </div>

                    <div className="matched-courses-list">
                      <h4>Recommended Certifications for {targetRole}</h4>
                      <div className="recommended-list">
                        {matchData.matchedCourses.length > 0 ? (
                          matchData.matchedCourses.map(course => (
                            <div key={course.id} className="recommended-course-card">
                              <span className="rec-badge">Best Match</span>
                              <h5>{course.title}</h5>
                              <p className="rec-meta">{course.provider} • ⭐ {course.rating}</p>
                              <button onClick={() => requireUser(`/courses?search=${encodeURIComponent(course.title)}`)} className="btn-secondary mini-btn">
                                View syllabus
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="list-empty">
                            No immediate matching courses found. Try exploring our complete directory.
                            <br />
                            <button onClick={() => requireUser("/courses")} className="btn-primary" style={{ marginTop: 12 }}>
                              Browse Catalog
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </section>
              </div>
            )}

          </main>

          {/* Right Panel: Profile Completeness & Preferences Summary */}
          <aside className="home-right-panel">
            
            {/* User Profile Card */}
            <div className="profile-match-side-card glass-panel">
              <div className="side-card-header">
                <h3>Workspace Profile</h3>
              </div>
              <div className="profile-completeness">
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-fill" style={{ width: "70%" }}></div>
                </div>
                <div className="progress-labels">
                  <span>Syllabus preference set</span>
                  <strong>70% Complete</strong>
                </div>
              </div>
              
              <div className="profile-quick-details">
                <div className="detail-row">
                  <span>Account Email</span>
                  <strong>{user?.email || "Guest User"}</strong>
                </div>
                <div className="detail-row">
                  <span>Status</span>
                  <span className="active-pill">Premium Tier</span>
                </div>
              </div>

              <button className="btn-secondary btn-full-width" onClick={() => requireUser("/profile")}>
                <span>Manage Profile</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Quick Tips or Comparison Queue summary */}
            <div className="tips-side-card glass-panel">
              <h4>Active Insights Tooltip</h4>
              <ul>
                <li>📊 Use comparison view to compare syllabus coverage side-by-side.</li>
                <li>🎯 Select "AI & ML" matching to view job market salary estimations in India.</li>
                <li>🛡️ Government certifications audited via Swayam carry localized exam credits.</li>
              </ul>
            </div>

          </aside>

        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .home-page {
          padding-top: 110px;
          padding-bottom: 60px;
        }

        .home-shell {
          display: flex;
          flex-direction: column;
          gap: 28px;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* Premium Header banner */
        .home-topbar-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px 40px;
          background: linear-gradient(135deg, rgba(29, 92, 255, 0.05) 0%, rgba(9, 168, 216, 0.02) 100%), #FFFFFF;
          border: 1px solid var(--border-color);
        }

        .home-topbar-info h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 6px 0;
          letter-spacing: -0.02em;
        }

        .home-eyebrow-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--primary);
          background: var(--primary-light);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .home-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin: 0;
        }

        .home-topbar-actions {
          display: flex;
          gap: 12px;
        }

        /* 3-Column Layout structure */
        .home-dashboard {
          display: grid;
          grid-template-columns: 240px 1fr 280px;
          gap: 28px;
          align-items: start;
        }

        /* Sidebar Nav Styling */
        .home-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px 16px;
          background: #FFFFFF;
        }

        .sidebar-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-group-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding-left: 12px;
          margin-bottom: 8px;
        }

        .home-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          font-size: 0.9rem;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .home-nav-item:hover {
          color: var(--primary);
          background: var(--primary-light);
        }

        .home-nav-item.active {
          color: var(--primary);
          background: var(--primary-light);
          border-color: rgba(29, 92, 255, 0.1);
        }

        .sidebar-divider {
          height: 1px;
          background: var(--border-color);
        }

        .sidebar-helper-card {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-top: 10px;
          border: 1px solid var(--border-color);
        }

        .sidebar-helper-card h4 {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 8px 0 4px 0;
        }

        .sidebar-helper-card p {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0;
        }

        /* Right Panel side card styling */
        .home-right-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .profile-match-side-card {
          padding: 20px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .side-card-header h3 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .profile-completeness {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .progress-bar-wrapper {
          width: 100%;
          height: 6px;
          background: var(--bg-primary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--primary);
          border-radius: var(--radius-full);
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .profile-quick-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: var(--bg-primary);
          padding: 12px;
          border-radius: var(--radius-sm);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
        }

        .detail-row span {
          color: var(--text-secondary);
        }

        .detail-row strong {
          color: var(--text-primary);
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          max-width: 130px;
        }

        .active-pill {
          background: #DEF7EC;
          color: #03543F;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .btn-full-width {
          width: 100%;
          justify-content: center;
        }

        .tips-side-card {
          padding: 18px;
          background: #FFFFFF;
        }

        .tips-side-card h4 {
          font-size: 0.85rem;
          font-weight: 800;
          margin-bottom: 10px;
          color: var(--text-primary);
        }

        .tips-side-card ul {
          padding-left: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tips-side-card li {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        /* Main Dashboard view elements */
        .home-main {
          display: flex;
          flex-direction: column;
          gap: 28px;
          min-width: 0;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .metric-card {
          padding: 20px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
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

        /* SVG Chart Design */
        .chart-section {
          background: #FFFFFF;
          padding: 24px;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .chart-header h2 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 4px;
        }

        .chart-badge {
          background: #EFF6FF;
          color: var(--primary);
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(29, 92, 255, 0.15);
        }

        .dashboard-svg-chart {
          width: 100%;
          height: auto;
          display: block;
        }

        .chart-footer {
          margin-top: 14px;
          border-top: 1px solid var(--border-color);
          padding-top: 12px;
        }

        .chart-footer p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Lists Grid */
        .home-content-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .home-list-panel {
          padding: 24px;
          background: #FFFFFF;
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

        .panel-link {
          color: var(--primary);
          font-size: 0.8rem;
          font-weight: 800;
        }

        .home-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .course-row, .job-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: #FFFFFF;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all var(--transition-fast);
        }

        .course-row:hover, .job-row:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .course-row-details h3, .job-row-details h3 {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 2px 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-row-platform, .job-row-skills {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .row-meta, .growth-pill {
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

        .growth-pill {
          color: #03543F;
          background: #DEF7EC;
        }

        .list-empty {
          color: var(--text-muted);
          padding: 24px 0;
          text-align: center;
          font-size: 0.85rem;
        }

        /* Analytics Explorer page */
        .analytics-explorer, .matcher-workspace {
          background: #FFFFFF;
          padding: 32px;
        }

        .panel-header-action {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .panel-header-action h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .panel-header-action p {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.9rem;
        }

        .analytics-filter {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .analytics-filter label {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .form-select {
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
          font-weight: 600;
        }

        .form-select:focus {
          border-color: var(--primary);
        }

        .analytics-report-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .report-card {
          padding: 20px;
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .report-card h3 {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .report-card .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          display: block;
          margin-bottom: 4px;
        }

        .report-card .stat-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .featured-analytics-highlight {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--primary-light);
          padding: 16px 20px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(29, 92, 255, 0.1);
          margin-bottom: 28px;
        }

        .featured-analytics-highlight h4 {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          margin: 0 0 2px 0;
        }

        .highlight-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .provider-pricing-bar-chart h4 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .bar-chart-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bar-row {
          display: grid;
          grid-template-columns: 100px 1fr 120px;
          align-items: center;
          gap: 16px;
        }

        .bar-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .bar-track {
          height: 10px;
          background: var(--bg-primary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: var(--radius-full);
        }

        .bar-val {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          text-align: right;
        }

        /* Matcher Workspace */
        .matcher-workspace h2 {
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0 0 4px 0;
          color: var(--text-primary);
        }

        .matcher-intro {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin: 0 0 24px 0;
        }

        .matcher-form {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .experience-selector {
          display: flex;
          gap: 8px;
        }

        .exp-btn {
          flex: 1;
          padding: 8px;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .exp-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .exp-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: #FFFFFF;
        }

        .matcher-results {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 28px;
          align-items: start;
        }

        .match-score-radial {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          background: var(--bg-primary);
          padding: 24px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          text-align: center;
        }

        .radial-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 6px solid var(--primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          box-shadow: 0 4px 12px rgba(29, 92, 255, 0.15);
        }

        .radial-score {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }

        .radial-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .radial-explanation h4 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .radial-explanation p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        .matched-courses-list h4 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .recommended-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .recommended-course-card {
          padding: 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          position: relative;
        }

        .rec-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--primary);
          color: #FFFFFF;
          font-size: 0.62rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .recommended-course-card h5 {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 4px 0;
          padding-right: 70px;
        }

        .rec-meta {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
        }

        .mini-btn {
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 700;
        }

        /* Responsive Dashboard styling */
        @media (max-width: 1024px) {
          .home-dashboard {
            grid-template-columns: 1fr;
          }
          
          .home-sidebar {
            flex-direction: row;
            overflow-x: auto;
            white-space: nowrap;
          }

          .sidebar-group {
            flex-direction: row;
          }

          .sidebar-group-title, .sidebar-divider, .sidebar-helper-card {
            display: none;
          }

          .home-right-panel {
            grid-row: 2;
          }
        }

        @media (max-width: 768px) {
          .home-topbar-wrapper {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            padding: 20px;
          }

          .metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .home-content-grid, .analytics-report-grid, .matcher-form, .matcher-results {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
}
