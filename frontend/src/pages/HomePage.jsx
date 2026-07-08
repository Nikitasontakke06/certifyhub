import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Compass,
  Layers,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Award,
  LineChart,
  Settings,
  Activity,
  Code,
  Database,
  Palette,
  Shield,
  Cpu,
  Cloud,
  Check,
  ChevronRight
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
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "analytics" | "matcher"
  
  // Dynamic user data states
  const [userPrefs, setUserPrefs] = useState(null);
  const [personalizedRecs, setPersonalizedRecs] = useState([]);
  const [fetchingPrefs, setFetchingPrefs] = useState(false);

  // States for interactive Analytics tab
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // States for interactive Skill Matcher tab
  const [targetRole, setTargetRole] = useState("Fullstack Developer");
  const [userExperience, setUserExperience] = useState("Beginner");

  // Fetch preferences and recommendations from APIs on mount
  useEffect(() => {
    if (user && user.email) {
      setFetchingPrefs(true);
      
      // Fetch user profile preferences
      fetch(`/api/preferences?email=${encodeURIComponent(user.email)}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setUserPrefs(data);
        })
        .catch(err => console.error("Error loading preferences:", err));

      // Fetch personalized recommendations
      fetch(`/api/recommendations?email=${encodeURIComponent(user.email)}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setPersonalizedRecs(data))
        .catch(err => console.error("Error loading recommendations:", err))
        .finally(() => setFetchingPrefs(false));
    }
  }, [user]);

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

  // Categories list
  const categories = [
    { id: "programming", label: "Programming", icon: <Code size={16} /> },
    { id: "datascience", label: "Data Science", icon: <Database size={16} /> },
    { id: "design", label: "UI/UX Design", icon: <Palette size={16} /> },
    { id: "cybersecurity", label: "Cyber Security", icon: <Shield size={16} /> },
    { id: "aiml", label: "AI & ML", icon: <Cpu size={16} /> },
    { id: "cloudcomputing", label: "Cloud & DevOps", icon: <Cloud size={16} /> }
  ];

  // Dynamic calculations for Analytics tab based on loaded course data
  const getCategoryStats = () => {
    const filtered = selectedCategory === "all" 
      ? courses 
      : courses.filter(c => c.category === selectedCategory);
    
    if (filtered.length === 0) return { avgPrice: 0, topRated: "N/A", avgRating: 0, count: 0 };
    
    const totalVal = filtered.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const avgPrice = Math.round(totalVal / filtered.length);
    const sortedByRating = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const topRated = sortedByRating[0]?.title || "N/A";
    const avgRating = (filtered.reduce((acc, curr) => acc + (curr.rating || 0), 0) / filtered.length).toFixed(1);
    
    return { avgPrice, topRated, avgRating, count: filtered.length };
  };

  const catStats = getCategoryStats();

  // Skill Matcher Logic mapping target roles to actual course categories
  const calculateMatch = () => {
    let targetCat = "programming";
    let matchScore = 75;

    if (targetRole === "Data Scientist") {
      targetCat = "datascience";
      matchScore = userExperience === "Intermediate" ? 92 : userExperience === "Advanced" ? 95 : 78;
    } else if (targetRole === "AI Engineer") {
      targetCat = "aiml";
      matchScore = userExperience === "Advanced" ? 96 : userExperience === "Intermediate" ? 88 : 74;
    } else if (targetRole === "UI/UX Designer") {
      targetCat = "design";
      matchScore = userExperience === "Beginner" ? 82 : 88;
    } else {
      // Fullstack Developer
      targetCat = "programming";
      matchScore = userExperience === "Beginner" ? 89 : 91;
    }

    // Filter real courses matching the category
    const matchedCourses = courses
      .filter(c => c.category === targetCat)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);

    return { matchScore, matchedCourses };
  };

  const matchData = calculateMatch();

  return (
    <div className="home-page page-container">
      
      {/* Dynamic Welcome & Notification Banner */}
      <div className="home-header fade-in">
        <h1>Workspace Dashboard</h1>
        <p>
          Welcome back, <strong>{user?.name || user?.email?.split("@")[0] || "Learner"}</strong>. 
          {userPrefs ? (
            <span> Your target level is set to <span className="pref-highlight">{userPrefs.skillLevel}</span> with preferred domains: <span className="pref-highlight">{userPrefs.preferredDomains.join(", ")}</span>.</span>
          ) : (
            <span> Track certification matrices, syllabus overlays, and live hiring metrics across Indian job sectors.</span>
          )}
        </p>
      </div>

      <section className="home-shell fade-in">
        
        {/* Horizontal Navigation Tabs Bar */}
        <div className="home-tabs-nav glass-panel">
          <div className="tabs-nav-left">
            <button 
              className={`tab-nav-btn ${activeTab === "overview" ? "active" : ""}`} 
              onClick={() => setActiveTab("overview")}
            >
              <Compass size={16} />
              <span>Overview Hub</span>
            </button>
            <button 
              className={`tab-nav-btn ${activeTab === "analytics" ? "active" : ""}`} 
              onClick={() => setActiveTab("analytics")}
            >
              <LineChart size={16} />
              <span>Market Analytics</span>
            </button>
            <button 
              className={`tab-nav-btn ${activeTab === "matcher" ? "active" : ""}`} 
              onClick={() => setActiveTab("matcher")}
            >
              <Sparkles size={16} />
              <span>Profile Matcher</span>
            </button>
          </div>
          <div className="tabs-nav-right">
            <button className="tab-nav-btn link-style-btn" onClick={() => requireUser("/compare")}>
              <Layers size={16} />
              <span>Compare Center ({compareList.length})</span>
            </button>
            <button className="tab-nav-btn link-style-btn" onClick={() => requireUser("/jobs")}>
              <Briefcase size={16} />
              <span>Career Tracks</span>
            </button>
          </div>
        </div>

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
            
            {activeTab === "overview" && (
              <div className="tab-pane fade-in">
                
                {/* Metric Cards (Real values) */}
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

                {/* Personalized Recommendations Section (Real API output) */}
                {personalizedRecs.length > 0 && (
                  <section className="personalized-recommendations-section glass-panel">
                    <div className="section-header">
                      <div className="header-info">
                        <span className="home-eyebrow">Personalized Matching</span>
                        <h2>Recommended For You</h2>
                      </div>
                      <span className="engine-badge">AI Recommendation Engine</span>
                    </div>
                    <div className="personalized-grid">
                      {personalizedRecs.map(rec => (
                        <div key={rec.id} className="personalized-card glass-panel">
                          <div className="card-top">
                            <span className="rec-platform">{rec.provider}</span>
                            <span className="rec-price">{rec.price === 0 ? "Free" : `₹${rec.price.toLocaleString("en-IN")}`}</span>
                          </div>
                          <h4>{rec.title}</h4>
                          <div className="card-bottom">
                            <div className="rating">
                              <Star size={12} fill="var(--primary)" color="var(--primary)" />
                              <span>{rec.rating} ({rec.reviews ? rec.reviews.toLocaleString() : "0"} reviews)</span>
                            </div>
                            <button 
                              onClick={() => onToggleCompare(rec)}
                              className={`btn-secondary mini-btn ${compareList.some(item => item.id === rec.id) ? "compared" : ""}`}
                            >
                              {compareList.some(item => item.id === rec.id) ? <Check size={12} /> : "+ Compare"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* SVG Demand Trend Chart Section */}
                <section className="chart-section glass-panel">
                  <div className="chart-header">
                    <div>
                      <span className="home-eyebrow">Interactive Insights</span>
                      <h2>Skills Demand vs Course Costs</h2>
                    </div>
                    <span className="chart-badge">Live Index</span>
                  </div>
                  <div className="chart-body">
                    <svg viewBox="0 0 800 220" className="dashboard-svg-chart">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>
                      <line x1="50" y1="20" x2="50" y2="180" stroke="var(--border-color)" strokeWidth="1" />
                      <line x1="50" y1="180" x2="780" y2="180" stroke="var(--border-color)" strokeWidth="1" />
                      
                      <line x1="50" y1="60" x2="780" y2="60" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="0.5" />
                      <line x1="50" y1="120" x2="780" y2="120" stroke="var(--border-color)" strokeDasharray="4 4" strokeWidth="0.5" />

                      <path d="M 50 180 L 150 130 L 250 145 L 350 80 L 450 110 L 550 50 L 650 75 L 750 30 L 750 180 Z" fill="url(#chartGrad)" />
                      
                      <path d="M 50 180 L 150 130 L 250 145 L 350 80 L 450 110 L 550 50 L 650 75 L 750 30" 
                            fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
                      
                      <circle cx="150" cy="130" r="5" fill="var(--primary)" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="350" cy="80" r="5" fill="var(--primary)" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="550" cy="50" r="5" fill="var(--primary)" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="750" cy="30" r="5" fill="var(--primary)" stroke="#fff" strokeWidth="1.5" />

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
                          <div 
                            key={course.id} 
                            className="course-row-item"
                          >
                            <button 
                              className="course-row-main"
                              onClick={() => requireUser(`/courses?search=${encodeURIComponent(course.title)}`)}
                            >
                              <div className="course-row-details">
                                <h3>{course.title}</h3>
                                <span className="course-row-platform">{course.provider} • ₹{course.price === 0 ? "Free" : course.price.toLocaleString("en-IN")}</span>
                              </div>
                            </button>
                            <div className="course-row-actions">
                              <button 
                                onClick={() => onToggleCompare(course)}
                                className={`row-action-compare-btn ${compareList.some(item => item.id === course.id) ? "compared" : ""}`}
                                title={compareList.some(item => item.id === course.id) ? "Remove from comparison" : "Add to comparison"}
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
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="analytics-report-grid">
                    <div className="report-card">
                      <h3>Average Price</h3>
                      <span className="stat-value">₹{catStats.avgPrice.toLocaleString("en-IN")}</span>
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
                            <div key={course.id} className="recommended-course-card glass-panel">
                              <span className="rec-badge">Best Match</span>
                              <h5>{course.title}</h5>
                              <p className="rec-meta">{course.provider} • ⭐ {course.rating} • {course.price === 0 ? "Free" : `₹${course.price.toLocaleString("en-IN")}`}</p>
                              <div className="rec-actions">
                                <button 
                                  onClick={() => requireUser(`/courses?search=${encodeURIComponent(course.title)}`)} 
                                  className="btn-secondary mini-btn"
                                >
                                  View Syllabus
                                </button>
                                <button 
                                  onClick={() => onToggleCompare(course)}
                                  className={`btn-primary mini-btn ${compareList.some(item => item.id === course.id) ? "compared" : ""}`}
                                >
                                  {compareList.some(item => item.id === course.id) ? <Check size={12} /> : "Add Compare"}
                                </button>
                              </div>
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
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .home-page {
          display: flex;
          flex-direction: column;
        }

        .home-header {
          margin-bottom: 32px;
        }

        .home-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
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
          gap: 24px;
        }

        /* Horizontal Navigation Tabs Bar */
        .home-tabs-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
        }

        .tabs-nav-left, .tabs-nav-right {
          display: flex;
          gap: 8px;
        }

        .tab-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          padding: 10px 16px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tab-nav-btn:hover {
          color: var(--primary);
          background: var(--primary-light);
        }

        .tab-nav-btn.active {
          color: var(--primary);
          background: var(--primary-light);
          border-color: var(--primary-glow);
        }

        .link-style-btn {
          opacity: 0.85;
        }

        .link-style-btn:hover {
          opacity: 1;
        }

        /* Quick Category Strip */
        .category-navigation-strip {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 8px 0;
          background: transparent;
          border: none;
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
          gap: 24px;
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

        /* Personalized Recommendations Grid */
        .personalized-recommendations-section {
          padding: 24px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .engine-badge {
          background: #DEF7EC;
          color: #03543F;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(3, 84, 63, 0.15);
        }

        .personalized-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .personalized-card {
          padding: 18px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all var(--transition-fast);
        }

        .personalized-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rec-platform {
          font-size: 0.72rem;
          font-weight: 800;
          background: var(--primary-light);
          color: var(--primary);
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .rec-price {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .personalized-card h4 {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.4;
          margin: 0;
          height: 38px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .personalized-card .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .mini-btn {
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .mini-btn.compared {
          background: #DEF7EC;
          color: #03543F;
          border-color: rgba(3, 84, 63, 0.15);
        }

        /* Metrics grid */
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
          background: var(--bg-glass);
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
          background: var(--bg-glass);
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

        .home-eyebrow {
          display: inline-block;
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .chart-badge {
          background: var(--primary-light);
          color: var(--primary);
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-glow);
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
          background: var(--bg-glass);
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

        .course-row-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          transition: all var(--transition-fast);
        }

        .course-row-item:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .course-row-main {
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          flex-grow: 1;
          padding: 0;
        }

        .course-row-details h3 {
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
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .row-action-compare-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-light);
        }

        .row-action-compare-btn.compared {
          background: #DEF7EC;
          color: #03543F;
          border-color: rgba(3, 84, 63, 0.15);
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

        .job-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all var(--transition-fast);
        }

        .job-row:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .job-row-details h3 {
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

        .job-row-skills {
          font-size: 0.75rem;
          color: var(--text-secondary);
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
          background: var(--bg-glass);
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
          background: var(--bg-secondary);
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
          background: var(--bg-secondary);
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
          border: 1px solid var(--border-glow);
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
          background: var(--bg-secondary);
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
          background: var(--bg-secondary);
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
          background: var(--bg-secondary);
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
          background: var(--bg-secondary);
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
          background: var(--bg-secondary);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rec-badge {
          align-self: flex-start;
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
          margin: 0;
        }

        .rec-meta {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .rec-actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        @media (max-width: 1024px) {
          .home-tabs-nav {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          
          .tabs-nav-left, .tabs-nav-right {
            justify-content: center;
          }

          .category-navigation-strip {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 768px) {
          .metric-grid, .personalized-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .home-content-grid, .analytics-report-grid, .matcher-form, .matcher-results {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .metric-grid, .personalized-grid {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
}
