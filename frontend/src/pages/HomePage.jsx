import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../utils/auth";
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
  Check,
  Bookmark
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
  const [activeTab, setActiveTab] = useState("searched");
  const [heroSearchVal, setHeroSearchVal] = useState("");
  const [savedCourses, setSavedCourses] = useState([]);

  // Fetch Bookmarks
  const fetchSavedCourses = () => {
    if (user && user.email) {
      fetch("/api/saved-institutes", {
        headers: getAuthHeaders()
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.savedInstituteCourses) {
            setSavedCourses(data.savedInstituteCourses);
          }
        })
        .catch(err => console.error("Error loading bookmarks:", err));
    }
  };

  useEffect(() => {
    fetchSavedCourses();
  }, [user]);

  const toggleBookmark = (courseId) => {
    if (!user) {
      openAuth();
      return;
    }
    fetch("/api/saved-institutes/toggle", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ courseId })
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.savedInstituteCourses) {
          setSavedCourses(data.savedInstituteCourses);
        }
      })
      .catch(err => console.error("Error toggling bookmark:", err));
  };

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      openAuth();
      return;
    }
    if (heroSearchVal.trim()) {
      navigate(`/courses?search=${encodeURIComponent(heroSearchVal)}`);
      setHeroSearchVal("");
    }
  };

  // Fetch preferences from API on mount
  useEffect(() => {
    if (user && user.email) {
      fetch("/api/preferences", {
        headers: getAuthHeaders()
      })
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

  // Helper to render skeleton placeholders
  const renderListSkeletons = () => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <div key={idx} className="course-row-skeleton">
        <div className="skeleton-main">
          <div className="skeleton-title shimmer"></div>
          <div className="skeleton-sub shimmer"></div>
        </div>
        <div className="skeleton-actions">
          <div className="skeleton-btn shimmer"></div>
          <div className="skeleton-meta shimmer"></div>
        </div>
      </div>
    ));
  };

  const getProviderBadge = (provider) => {
    let className = "provider-tag-generic";
    const name = provider ? provider.trim() : "";
    
    if (/udemy/i.test(name)) {
      className = "provider-tag-udemy";
    } else if (/coursera/i.test(name)) {
      className = "provider-tag-coursera";
    } else if (/simplilearn/i.test(name)) {
      className = "provider-tag-simplilearn";
    } else if (/great learning/i.test(name)) {
      className = "provider-tag-greatlearning";
    } else if (/swayam/i.test(name)) {
      className = "provider-tag-swayam";
    } else if (/datacamp/i.test(name)) {
      className = "provider-tag-datacamp";
    } else if (/tryhackme/i.test(name)) {
      className = "provider-tag-tryhackme";
    } else if (/pmi|project management/i.test(name)) {
      className = "provider-tag-pmi";
    } else if (/hubspot/i.test(name)) {
      className = "provider-tag-hubspot";
    }
    
    return (
      <span className={`provider-badge ${className}`}>
        {provider}
      </span>
    );
  };

  const getSparklineData = (courseId, seed = 0) => {
    const charCodes = courseId.split("").map(c => c.charCodeAt(0));
    const points = [];
    const length = 6;
    for (let i = 0; i < length; i++) {
      const code = charCodes[(i + seed) % charCodes.length] || 50;
      const heightVal = 4 + (code % 18); // range: 4 to 22
      points.push(heightVal);
    }
    return points;
  };

  const renderSparkline = (courseId, seed = 0, isUp = true) => {
    const data = getSparklineData(courseId, seed);
    const width = 60;
    const height = 24;
    const xStep = width / (data.length - 1);
    
    let pathD = `M 0,${height - data[0]}`;
    for (let i = 1; i < data.length; i++) {
      pathD += ` L ${i * xStep},${height - data[i]}`;
    }
    
    const strokeColor = isUp ? "#10b981" : "var(--primary)";
    const fillColor = isUp ? "rgba(16, 185, 129, 0.05)" : "rgba(29, 92, 255, 0.05)";
    const fillPathD = `${pathD} L ${width},${height} L 0,${height} Z`;
    
    return (
      <svg width={width} height={height} className="sparkline-chart" style={{ display: "block" }}>
        <path d={fillPathD} fill={fillColor} stroke="none" />
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={width} cy={height - data[data.length - 1]} r="2" fill={strokeColor} />
      </svg>
    );
  };

  return (
    <div className="home-page page-container">
      
      {/* Dynamic Welcome Hero Banner (edX & Coursera inspired) */}
      <div className="home-hero-card fade-in">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <Sparkles size={14} className="sparkle-icon" />
            <span>LEARNING HUB COMMAND CENTER</span>
          </div>
          <h1>Welcome back, {user?.name || user?.email?.split("@")[0] || "Learner"}!</h1>
          <p>
            {userPrefs ? (
              <span>
                Your target level is currently configured to <strong className="pref-badge">{userPrefs.skillLevel}</strong>. 
                {userPrefs.preferredDomains && userPrefs.preferredDomains.length > 0 ? (
                  <span> We've tailored your dashboard insights for <strong className="pref-badge">{userPrefs.preferredDomains.join(", ")}</strong>.</span>
                ) : (
                  <span> Explore our curated certification paths below to expand your skill horizons.</span>
                )}
              </span>
            ) : (
              <span>Explore our curated certification paths and track trending comparisons below.</span>
            )}
          </p>

          {/* Inline Hero Search Bar */}
          <form onSubmit={handleHeroSearchSubmit} className="hero-search-form">
            <Search size={18} className="hero-search-icon" />
            <input 
              type="text" 
              placeholder="What skill, certification, or platform do you want to learn today?" 
              value={heroSearchVal}
              onChange={(e) => setHeroSearchVal(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="hero-search-btn">
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Integrated Quick Analytics Metrics Grid */}
        <div className="hero-stats-grid">
          <div className="hero-stat-card">
            <BookOpen size={18} />
            <div className="hero-stat-text">
              {loading ? (
                <div className="skeleton-text-shimmer shimmer" style={{ width: "40px" }} />
              ) : (
                <strong>{courses.length}</strong>
              )}
              <span>Courses</span>
            </div>
          </div>
          
          <div className="hero-stat-card">
            <CheckCircle2 size={18} />
            <div className="hero-stat-text">
              {loading ? (
                <div className="skeleton-text-shimmer shimmer" style={{ width: "40px" }} />
              ) : (
                <strong>{freeCourses}</strong>
              )}
              <span>Free Certs</span>
            </div>
          </div>

          <div className="hero-stat-card">
            <BarChart3 size={18} />
            <div className="hero-stat-text">
              {loading ? (
                <div className="skeleton-text-shimmer shimmer" style={{ width: "40px" }} />
              ) : (
                <strong>{providerCount}</strong>
              )}
              <span>Platforms</span>
            </div>
          </div>

          <div className="hero-stat-card">
            <Briefcase size={18} />
            <div className="hero-stat-text">
              {loading ? (
                <div className="skeleton-text-shimmer shimmer" style={{ width: "40px" }} />
              ) : (
                <strong>{jobs.length}</strong>
              )}
              <span>Active Roles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Two-Column Dashboard Layout */}
      <div className="home-grid-layout fade-in">
        
        {/* Left Column: Primary Analytics & Market Insights */}
        <div className="main-content-column">
          
          {/* Resume Learning Progress Card (Udemy & LinkedIn Learning inspired) */}
          <div className="resume-learning-card glass-panel">
            <div className="resume-header">
              <span className="home-eyebrow">RESUME LEARNING</span>
              <span className="last-accessed-text">Last active: 2 hours ago</span>
            </div>
            <div className="resume-body">
              <div className="resume-course-info">
                <h3>React - The Complete Guide (2026 Edition)</h3>
                <div className="resume-meta-row">
                  {getProviderBadge("Udemy")}
                  <span className="resume-time-left">12 hours left &bull; 86 of 134 lectures</span>
                </div>
              </div>
              <div className="resume-progress-container">
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: "64%" }}></div>
                </div>
                <span className="progress-percentage-text">64%</span>
              </div>
              <a 
                href="https://www.udemy.com/course/react-the-complete-guide-incl-redux-react-router-nextjs/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary resume-action-btn"
                style={{ textDecoration: "none" }}
              >
                <span>Resume Course</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Market Insights Hub (Segmented Switcher) */}
          <section className="insights-hub-panel glass-panel">
            <div className="insights-hub-header">
              <div className="insights-title">
                <h2>Market Trends & Insights</h2>
                <p>Track real-time search volume, comparison popularity, and structured matchups.</p>
              </div>
              <div className="insights-tabs">
                <button 
                  className={`tab-btn ${activeTab === "searched" ? "active" : ""}`}
                  onClick={() => setActiveTab("searched")}
                >
                  <Search size={14} />
                  <span>Most Searched</span>
                </button>
                <button 
                  className={`tab-btn ${activeTab === "compared" ? "active" : ""}`}
                  onClick={() => setActiveTab("compared")}
                >
                  <Layers size={14} />
                  <span>Most Compared</span>
                </button>
                <button 
                  className={`tab-btn ${activeTab === "watchlist" ? "active" : ""}`}
                  onClick={() => {
                    if (!user) {
                      openAuth();
                      return;
                    }
                    setActiveTab("watchlist");
                  }}
                >
                  <Bookmark size={14} />
                  <span>My Watchlist</span>
                </button>
                <button 
                  className={`tab-btn ${activeTab === "matchups" ? "active" : ""}`}
                  onClick={() => setActiveTab("matchups")}
                >
                  <Sparkles size={14} />
                  <span>Trending VS</span>
                </button>
              </div>
            </div>

            <div className="insights-tab-content">
              {/* Tab: Most Searched */}
              {activeTab === "searched" && (
                <div className="insights-list fade-in">
                  {loading ? (
                    renderListSkeletons()
                  ) : mostSearchedCourses.length > 0 ? (
                    mostSearchedCourses.map(course => (
                      <div key={course.id} className="course-row-item">
                        <button 
                          className="course-row-main"
                          onClick={() => requireUser(`/courses?search=${encodeURIComponent(course.title)}`)}
                        >
                          <div className="course-row-details">
                            <h3>{course.title}</h3>
                            <span className="course-row-platform">
                              {getProviderBadge(course.provider)} &bull; Searched <strong>{course.searchedCount}</strong> times
                            </span>
                          </div>
                        </button>
                        
                        <div className="course-row-sparkline" title="Interest trend">
                          {renderSparkline(course.id, 0, course.rating >= 4.5)}
                        </div>

                        <div className="course-row-actions">
                          <button 
                            onClick={() => onToggleCompare(course)}
                            className={`row-action-compare-btn ${compareList.some(item => item.id === course.id) ? "compared" : ""}`}
                          >
                            {compareList.some(item => item.id === course.id) ? <Check size={14} /> : "Compare"}
                          </button>
                          <button 
                            onClick={() => toggleBookmark(course.id)}
                            className={`row-action-bookmark-btn ${savedCourses.includes(course.id) ? "saved" : ""}`}
                            title={savedCourses.includes(course.id) ? "Remove from watchlist" : "Save for later"}
                          >
                            <Bookmark size={14} fill={savedCourses.includes(course.id) ? "var(--primary)" : "none"} />
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
                  <div className="panel-footer-action">
                    <button onClick={() => navigate("/courses")} className="btn-secondary">
                      <span>Explore Course Catalog</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Most Compared */}
              {activeTab === "compared" && (
                <div className="insights-list fade-in">
                  {loading ? (
                    renderListSkeletons()
                  ) : mostComparedCourses.length > 0 ? (
                    mostComparedCourses.map(course => (
                      <div key={course.id} className="course-row-item">
                        <button 
                          className="course-row-main"
                          onClick={() => requireUser(`/courses?search=${encodeURIComponent(course.title)}`)}
                        >
                          <div className="course-row-details">
                            <h3>{course.title}</h3>
                            <span className="course-row-platform">
                              {getProviderBadge(course.provider)} &bull; Compared <strong>{course.comparedCount}</strong> times
                            </span>
                          </div>
                        </button>
                        
                        <div className="course-row-sparkline" title="Interest trend">
                          {renderSparkline(course.id, 1, course.rating >= 4.5)}
                        </div>

                        <div className="course-row-actions">
                          <button 
                            onClick={() => onToggleCompare(course)}
                            className={`row-action-compare-btn ${compareList.some(item => item.id === course.id) ? "compared" : ""}`}
                          >
                            {compareList.some(item => item.id === course.id) ? <Check size={14} /> : "Compare"}
                          </button>
                          <button 
                            onClick={() => toggleBookmark(course.id)}
                            className={`row-action-bookmark-btn ${savedCourses.includes(course.id) ? "saved" : ""}`}
                            title={savedCourses.includes(course.id) ? "Remove from watchlist" : "Save for later"}
                          >
                            <Bookmark size={14} fill={savedCourses.includes(course.id) ? "var(--primary)" : "none"} />
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
                  <div className="panel-footer-action">
                    <button onClick={() => navigate("/compare")} className="btn-secondary">
                      <span>Open Comparison Center</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: My Watchlist */}
              {activeTab === "watchlist" && (
                <div className="insights-list fade-in">
                  {enhancedCourses.filter(c => savedCourses.includes(c.id)).length > 0 ? (
                    enhancedCourses.filter(c => savedCourses.includes(c.id)).map(course => (
                      <div key={course.id} className="course-row-item">
                        <button 
                          className="course-row-main"
                          onClick={() => requireUser(`/courses?search=${encodeURIComponent(course.title)}`)}
                        >
                          <div className="course-row-details">
                            <h3>{course.title}</h3>
                            <span className="course-row-platform">
                              {getProviderBadge(course.provider)} &bull; rating <strong>{course.rating}</strong>
                            </span>
                          </div>
                        </button>
                        
                        <div className="course-row-sparkline" title="Interest trend">
                          {renderSparkline(course.id, 2, course.rating >= 4.5)}
                        </div>

                        <div className="course-row-actions">
                          <button 
                            onClick={() => onToggleCompare(course)}
                            className={`row-action-compare-btn ${compareList.some(item => item.id === course.id) ? "compared" : ""}`}
                          >
                            {compareList.some(item => item.id === course.id) ? <Check size={14} /> : "Compare"}
                          </button>
                          <button 
                            onClick={() => toggleBookmark(course.id)}
                            className={`row-action-bookmark-btn saved`}
                            title="Remove from watchlist"
                          >
                            <Bookmark size={14} fill="var(--primary)" />
                          </button>
                          <div className="row-meta">
                            <Star size={12} fill="var(--primary)" color="var(--primary)" />
                            <strong>{course.rating}</strong>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="list-empty" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0" }}>
                      <Bookmark size={36} style={{ color: "var(--text-muted)", marginBottom: 12, opacity: 0.7 }} />
                      <p style={{ margin: 0, fontWeight: 700, color: "var(--text-secondary)" }}>Your watchlist is empty</p>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                        Save courses from the tabs or catalog to watch them next time you are free!
                      </span>
                    </div>
                  )}
                  <div className="panel-footer-action">
                    <button onClick={() => navigate("/courses")} className="btn-secondary">
                      <span>Browse More Courses</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Matchups */}
              {activeTab === "matchups" && (
                <div className="matchups-grid fade-in">
                  {matchups.map((match, idx) => (
                    <div key={idx} className="matchup-item glass-panel">
                      <div className="matchup-vs-container">
                        <div className="matchup-course-box">
                          <h4>{match.title1}</h4>
                          {getProviderBadge(match.provider1)}
                        </div>
                        <div className="vs-divider">
                          <div className="vs-line"></div>
                          <div className="vs-circle-small">VS</div>
                        </div>
                        <div className="matchup-course-box">
                          <h4>{match.title2}</h4>
                          {getProviderBadge(match.provider2)}
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
                        <span>Launch Side-by-Side</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Recommended Offline Classes Section */}
          <div className="home-offline-recommendations-section glass-panel">
            <div className="section-header">
              <div>
                <span className="home-eyebrow">Offline Class Discovery</span>
                <h2>Recommended Coaching Centers Near You</h2>
              </div>
              <button onClick={() => navigate("/offline-classes")} className="btn-secondary header-btn">
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

          {/* Integrated Learning Providers (edX style footer) */}
          <div className="partners-strip-card glass-panel fade-in">
            <span className="partners-title">Integrated Platforms</span>
            <div className="partners-grid">
              {getProviderBadge("Udemy")}
              {getProviderBadge("Coursera")}
              {getProviderBadge("Simplilearn")}
              {getProviderBadge("Great Learning")}
              {getProviderBadge("PW Skills")}
              {getProviderBadge("Swayam")}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Sidebar Controls */}
        <div className="sidebar-column">
          
          {/* Weekly Learning Goal & Streaks (LinkedIn Learning style) */}
          <div className="sidebar-card glass-panel goal-tracking-card">
            <div className="streak-header">
              <div className="streak-badge-wrapper">
                <span className="streak-icon">🔥</span>
                <strong>5 Day Streak</strong>
              </div>
              <span className="streak-milestone-text">Keep it up!</span>
            </div>
            
            <div className="goal-progress-section">
              <div className="goal-labels">
                <h3>Weekly Learning Goal</h3>
                <span>4.2 / 6 hrs</span>
              </div>
              <div className="goal-bar-container">
                <div className="goal-bar-fill" style={{ width: "70%" }}></div>
              </div>
              <p className="goal-insight-text">You are on track to meet your target. Learn 1.8 hours more by Sunday.</p>
            </div>
          </div>

          {/* Learning Preferences Summary Card */}
          <div className="sidebar-card glass-panel profile-summary-card">
            <div className="card-header-icon"><Sparkles size={18} /></div>
            <div className="card-inner-content">
              <h3>Target Preferences</h3>
              <p>Your certification suggestions are filtered based on your learning settings.</p>
              
              <div className="prefs-status">
                <div className="pref-item">
                  <span className="pref-label">Skill Level:</span>
                  <span className="pref-val">{userPrefs?.skillLevel || "Beginner"}</span>
                </div>
                <div className="pref-item">
                  <span className="pref-label">Focus Areas:</span>
                  <span className="pref-val limit-text" title={userPrefs?.preferredDomains?.join(", ")}>
                    {userPrefs?.preferredDomains && userPrefs.preferredDomains.length > 0 
                      ? userPrefs.preferredDomains.join(", ") 
                      : "None"}
                  </span>
                </div>
              </div>
              
              <button onClick={() => navigate("/profile")} className="btn-primary sidebar-btn">
                <span>Configure Profile</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Real-time Compare Queue Sidebar Widget */}
          {compareList.length > 0 && (
            <div className="sidebar-card glass-panel compare-queue-card">
              <div className="queue-header">
                <div className="queue-title-wrapper">
                  <Layers size={18} color="var(--primary)" />
                  <h3>Compare Queue</h3>
                </div>
                <span className="queue-pill">{compareList.length} / 3</span>
              </div>
              <p className="queue-info">Quickly overlay pricing, hours, and curriculum for selected courses.</p>
              
              <div className="sidebar-queue-list">
                {compareList.map(item => (
                  <div key={item.id} className="sidebar-queue-item">
                    <div className="queue-item-details">
                      <strong>{item.title}</strong>
                      <span>{getProviderBadge(item.provider)}</span>
                    </div>
                    <button 
                      onClick={() => onToggleCompare(item)} 
                      className="queue-remove-btn"
                      title="Remove from queue"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              
              <button onClick={() => navigate("/compare")} className="btn-primary sidebar-btn">
                <span>Launch Matrices</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Quick Category Finder Card */}
          <div className="sidebar-card glass-panel category-finder-card">
            <h3>Quick Category Finder</h3>
            <p>Direct filter shortcuts to target certification streams.</p>
            <div className="sidebar-category-grid">
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  className="sidebar-cat-btn"
                  onClick={() => requireUser(`/courses?category=${cat.id}`)}
                >
                  <span className="cat-icon-wrap">{cat.icon}</span>
                  <span className="cat-label-text">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .home-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding-top: 84px;
        }

        /* Welcome Hero Card */
        .home-hero-card {
          position: relative;
          padding: 36px 44px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--bg-glass) 0%, var(--primary-light) 100%);
          border: 1px solid var(--border-color);
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: var(--shadow-glass);
          gap: 40px;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          flex: 1.4;
          min-width: 0;
        }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .sparkle-icon {
          animation: pulse 2s infinite ease-in-out;
        }

        .home-hero-card h1 {
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0 0 12px 0;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .home-hero-card p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        .pref-badge {
          background: var(--bg-tertiary);
          color: var(--primary);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.85rem;
          border: 1px solid var(--border-color);
        }

        /* Inline Hero Search Bar */
        .hero-search-form {
          display: flex;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 6px 6px 6px 16px;
          margin-top: 24px;
          max-width: 580px;
          box-shadow: var(--shadow-sm);
          gap: 12px;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .hero-search-form:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 12px var(--primary-glow);
        }

        .hero-search-icon {
          color: var(--text-secondary);
          flex-shrink: 0;
        }

        .hero-search-input {
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 0.88rem;
          flex: 1;
          outline: none;
          width: 100%;
        }

        .hero-search-input::placeholder {
          color: var(--text-muted);
        }

        .hero-search-btn {
          background: var(--primary);
          color: #ffffff;
          border: none;
          border-radius: var(--radius-sm);
          padding: 8px 18px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .hero-search-btn:hover {
          background: var(--primary-hover);
        }

        /* Hero Stats Grid */
        .hero-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          flex: 1;
          min-width: 300px;
          z-index: 2;
        }

        .hero-stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
        }

        .hero-stat-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .hero-stat-card svg {
          color: var(--primary);
          flex-shrink: 0;
        }

        .hero-stat-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .hero-stat-text strong {
          color: var(--text-primary);
          font-size: 1.05rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .hero-stat-text span {
          color: var(--text-secondary);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        /* Resume Learning Card */
        .resume-learning-card {
          padding: 24px 28px;
          background: var(--bg-glass);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .resume-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .last-accessed-text {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .resume-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          flex-wrap: wrap;
        }

        .resume-course-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1.5;
          min-width: 250px;
        }

        .resume-course-info h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.4;
        }

        .resume-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .resume-time-left {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .resume-progress-container {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1.2;
          min-width: 200px;
        }

        .progress-bar-wrap {
          flex: 1;
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--accent-cyan));
          border-radius: var(--radius-full);
        }

        .progress-percentage-text {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--primary);
          min-width: 32px;
          text-align: right;
        }

        .resume-action-btn {
          flex-shrink: 0;
          padding: 10px 20px;
          font-size: 0.85rem;
        }

        /* Two Column Grid */
        .home-grid-layout {
          display: grid;
          grid-template-columns: 2.2fr 1fr;
          gap: 32px;
          align-items: start;
        }

        .main-content-column {
          display: flex;
          flex-direction: column;
          gap: 32px;
          min-width: 0;
        }

        .sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 28px;
          position: sticky;
          top: 24px;
        }

        /* Goal Tracking Card */
        .goal-tracking-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .streak-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--primary-light);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-glow);
        }

        .streak-badge-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
        }

        .streak-badge-wrapper strong {
          color: var(--primary);
          font-weight: 800;
        }

        .streak-milestone-text {
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .goal-progress-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .goal-labels {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .goal-labels h3 {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .goal-labels span {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .goal-bar-container {
          width: 100%;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .goal-bar-fill {
          height: 100%;
          background: var(--primary);
          border-radius: var(--radius-full);
        }

        .goal-insight-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        /* Market Insights Hub */
        .insights-hub-panel {
          padding: 28px;
          background: var(--bg-glass);
        }

        .insights-hub-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .insights-title h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .insights-title p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .insights-tabs {
          display: flex;
          gap: 6px;
          background: var(--bg-tertiary);
          padding: 4px;
          border-radius: var(--radius-md);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          background: transparent;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        .tab-btn.active {
          background: var(--bg-secondary);
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .course-row-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .course-row-item:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        .course-row-main {
          background: transparent;
          border: none;
          padding: 0;
          text-align: left;
          cursor: pointer;
          flex: 1;
          margin-right: 16px;
        }

        .course-row-details h3 {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 4px 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-row-platform {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
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

        .row-action-bookmark-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .row-action-bookmark-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-light);
        }

        .row-action-bookmark-btn.saved {
          color: var(--primary);
          border-color: var(--primary);
          background: var(--primary-light);
        }

        .row-meta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--primary);
          background: var(--primary-light);
          border-radius: var(--radius-full);
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .panel-footer-action {
          margin-top: 12px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }

        .panel-footer-action .btn-secondary {
          padding: 10px 18px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* Matchups Grid */
        .matchups-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .matchup-item {
          padding: 20px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all var(--transition-normal);
        }

        .matchup-item:hover {
          border-color: rgba(29, 92, 255, 0.25);
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
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
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          transition: border-color var(--transition-fast);
        }

        .matchup-course-box h4 {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

        /* Sidebar Styling */
        .sidebar-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: var(--bg-glass);
        }

        .card-header-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-card h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .sidebar-card p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.45;
        }

        .sidebar-btn {
          width: 100%;
          justify-content: center;
          padding: 10px;
          font-size: 0.85rem;
        }

        /* Preferences summary inside sidebar */
        .prefs-status {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(29, 92, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 14px;
        }

        .pref-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          gap: 10px;
        }

        .pref-label {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .pref-val {
          color: var(--text-primary);
          font-weight: 700;
          text-align: right;
        }

        .pref-val.limit-text {
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Sidebar compare queue widget */
        .queue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
        }

        .queue-title-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .queue-title-wrapper h3 {
          margin: 0;
          font-size: 1.05rem;
        }

        .queue-pill {
          background: var(--primary);
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-full);
        }

        .queue-info {
          font-size: 0.78rem !important;
        }

        .sidebar-queue-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-queue-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          gap: 8px;
        }

        .queue-item-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .queue-item-details strong {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }

        .queue-item-details span {
          font-size: 0.68rem;
          color: var(--text-muted);
          display: flex;
        }

        .queue-remove-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          font-weight: 300;
          cursor: pointer;
          padding: 0 4px;
          line-height: 1;
          transition: color var(--transition-fast);
        }

        .queue-remove-btn:hover {
          color: var(--error);
        }

        /* Sidebar category grid */
        .sidebar-category-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .sidebar-cat-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 6px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .sidebar-cat-btn:hover {
          border-color: var(--primary);
          background: var(--primary-light);
        }

        .cat-icon-wrap {
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color var(--transition-fast);
        }

        .sidebar-cat-btn:hover .cat-icon-wrap {
          color: var(--primary);
        }

        .cat-label-text {
          font-size: 0.72rem;
          font-weight: 700;
          text-align: center;
          color: var(--text-primary);
        }

        /* Recommended Offline Coaching Centers Section */
        .home-offline-recommendations-section {
          padding: 28px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 14px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .header-btn {
          padding: 8px 16px !important;
          font-size: 0.8rem !important;
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .rec-inst-card {
          overflow: hidden;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-normal);
          display: flex;
          flex-direction: column;
        }

        .rec-inst-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary-glow);
          box-shadow: var(--shadow-md);
        }

        .rec-card-image {
          height: 110px;
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
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 3px 6px;
          border-radius: var(--radius-sm);
        }

        .rec-card-body {
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-glass);
        }

        .rec-logo {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          object-fit: cover;
          background: #ffffff;
        }

        .rec-text h3 {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.35;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 150px;
        }

        .rec-text span {
          font-size: 0.7rem;
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

        /* Partners strip */
        .partners-strip-card {
          padding: 18px 24px;
          background: var(--bg-glass);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .partners-title {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .partners-grid {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .list-empty {
          color: var(--text-muted);
          padding: 32px 0;
          text-align: center;
          font-size: 0.85rem;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        /* Responsiveness Media Queries */
        @media (max-width: 1024px) {
          .home-grid-layout {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .sidebar-column {
            position: relative;
            top: 0;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .category-finder-card {
            grid-column: span 2;
          }

          .home-hero-card {
            flex-direction: column;
            align-items: stretch;
            gap: 28px;
            padding: 28px 32px;
          }

          .hero-content {
            max-width: 100%;
          }

          .hero-stats-grid {
            grid-template-columns: repeat(4, 1fr);
            min-width: unset;
          }
        }

        @media (max-width: 768px) {
          .recommendations-grid {
            grid-template-columns: 1fr;
          }

          .sidebar-column {
            grid-template-columns: 1fr;
          }

          .category-finder-card {
            grid-column: span 1;
          }

          .matchups-grid {
            grid-template-columns: 1fr;
          }

          .insights-hub-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .insights-tabs {
            width: 100%;
            justify-content: space-between;
          }

          .tab-btn {
            flex: 1;
            justify-content: center;
            padding: 8px 10px;
            font-size: 0.78rem;
          }

          .resume-body {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .resume-course-info, .resume-progress-container {
            width: 100%;
            flex: unset;
          }

          .progress-percentage-text {
            text-align: right;
          }

          .hero-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .home-hero-card {
            padding: 24px 20px;
          }

          .home-hero-card h1 {
            font-size: 1.5rem;
          }

          .tab-btn span {
            display: none;
          }

          .tab-btn {
            padding: 8px 14px;
          }

          .hero-search-form {
            padding: 4px 4px 4px 12px;
          }

          .hero-search-btn {
            padding: 6px 12px;
          }

          .hero-stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        /* Shimmer Animation & Skeletons */
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            var(--bg-tertiary) 25%,
            var(--border-color) 37%,
            var(--bg-tertiary) 63%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }

        .course-row-skeleton {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          height: 64px;
        }

        .skeleton-main {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .skeleton-title {
          width: 50%;
          height: 12px;
          border-radius: var(--radius-sm);
        }

        .skeleton-sub {
          width: 25%;
          height: 8px;
          border-radius: var(--radius-sm);
        }

        .skeleton-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .skeleton-btn {
          width: 70px;
          height: 28px;
          border-radius: var(--radius-sm);
        }

        .skeleton-meta {
          width: 40px;
          height: 20px;
          border-radius: var(--radius-full);
        }

        .skeleton-text-shimmer {
          display: inline-block;
          width: 65px;
          height: 18px;
          border-radius: var(--radius-sm);
          margin-top: 2px;
        }

        /* Platform Brand Badges */
        .provider-badge {
          display: inline-flex;
          align-items: center;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .provider-tag-generic {
          background: rgba(148, 163, 184, 0.12);
          color: var(--text-secondary);
          border: 1px solid rgba(148, 163, 184, 0.25);
        }

        .provider-tag-udemy {
          background: rgba(164, 53, 240, 0.1);
          color: #a435f0;
          border: 1px solid rgba(164, 53, 240, 0.25);
        }

        .provider-tag-coursera {
          background: rgba(0, 86, 210, 0.1);
          color: #0056d2;
          border: 1px solid rgba(0, 86, 210, 0.25);
        }

        .provider-tag-simplilearn {
          background: rgba(239, 108, 0, 0.1);
          color: #e65100;
          border: 1px solid rgba(239, 108, 0, 0.25);
        }

        .provider-tag-greatlearning {
          background: rgba(15, 117, 188, 0.1);
          color: #0d47a1;
          border: 1px solid rgba(15, 117, 188, 0.25);
        }

        .provider-tag-swayam {
          background: rgba(229, 57, 53, 0.1);
          color: #d32f2f;
          border: 1px solid rgba(229, 57, 53, 0.25);
        }

        .provider-tag-datacamp {
          background: rgba(2, 196, 120, 0.1);
          color: #00796b;
          border: 1px solid rgba(2, 196, 120, 0.25);
        }

        .provider-tag-tryhackme {
          background: rgba(186, 12, 47, 0.1);
          color: #b71c1c;
          border: 1px solid rgba(186, 12, 47, 0.25);
        }

        .provider-tag-pmi {
          background: rgba(255, 193, 7, 0.12);
          color: #ff8f00;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .provider-tag-hubspot {
          background: rgba(255, 122, 89, 0.1);
          color: #e05c3e;
          border: 1px solid rgba(255, 122, 89, 0.25);
        }

        /* Sparkline Chart Style */
        .course-row-sparkline {
          margin: 0 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sparkline-chart {
          overflow: visible;
        }

        @media (max-width: 640px) {
          .course-row-sparkline {
            display: none;
          }
        }
      `}} />
    </div>
  );
}
