import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Search as SearchIcon,
  MapPin,
  Filter,
  Grid,
  List as ListIcon,
  Star,
  Layers,
  Heart,
  ChevronRight,
  BookOpen,
  Calendar,
  Clock,
  Map,
  Compass,
  DollarSign,
  Briefcase
} from "lucide-react";

export default function OfflineClassesPage({ user, openAuth, compareList = [], onToggleCompare }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  // State
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [showMap, setShowMap] = useState(true);
  const [savedInsts, setSavedInsts] = useState({ savedInstitutes: [], savedInstituteCourses: [] });

  // Filters state
  const [searchVal, setSearchVal] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [feeMax, setFeeMax] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [weekendOnly, setWeekendOnly] = useState(false);
  const [placementAssistance, setPlacementAssistance] = useState(false);

  // Selected institute on map hover/click
  const [selectedInstId, setSelectedInstId] = useState(null);

  // Fetch Institutes
  const fetchInstitutes = async () => {
    setLoading(true);
    try {
      let query = `?category=${categoryFilter}`;
      if (searchVal) query += `&search=${encodeURIComponent(searchVal)}`;
      if (cityFilter) query += `&location=${encodeURIComponent(cityFilter)}`;
      if (feeMax) query += `&feeMax=${feeMax}`;
      if (minRating) query += `&rating=${minRating}`;
      if (weekendOnly) query += `&weekend=true`;
      if (placementAssistance) query += `&placement=true`;

      const res = await fetch(`/api/institutes${query}`);
      if (res.ok) {
        const data = await res.json();
        setInstitutes(data);
      }
    } catch (err) {
      console.error("Error loading institutes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Bookmarks
  const fetchBookmarks = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/saved-institutes?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setSavedInsts(data);
      }
    } catch (err) {
      console.error("Error loading bookmarks:", err);
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, [categoryFilter, cityFilter, feeMax, minRating, weekendOnly, placementAssistance]);

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInstitutes();
  };

  const handleToggleSave = async (instId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuth();
      return;
    }
    try {
      const res = await fetch("/api/saved-institutes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, instituteId: instId })
      });
      if (res.ok) {
        const updated = await res.json();
        setSavedInsts(updated);
      }
    } catch (err) {
      console.error("Error saving bookmark:", err);
    }
  };

  const handleClearFilters = () => {
    setSearchVal("");
    setCityFilter("");
    setCategoryFilter("all");
    setFeeMax(100000);
    setMinRating(0);
    setWeekendOnly(false);
    setPlacementAssistance(false);
    navigate("/offline-classes");
  };

  const isSaved = (instId) => {
    return savedInsts.savedInstitutes.includes(instId);
  };

  // Category labels mapping
  const categoryLabels = {
    programming: "Programming",
    datascience: "Data Science",
    design: "UI/UX & Design",
    cybersecurity: "Cyber Security",
    cloudcomputing: "Cloud & DevOps",
    government: "Government Exams",
    business: "Management / MBA"
  };

  return (
    <div className="offline-classes-page page-container">
      
      {/* Header Banner */}
      <div className="classes-header fade-in">
        <h1>Discover Offline Coaching & Classes</h1>
        <p>Explore top rated physical classroom institutes, compare batch schedules, fees, and location options near you.</p>
      </div>

      <div className="classes-layout-container fade-in">
        
        {/* Left Side: Interactive Filters Panel */}
        <aside className="filters-sidebar glass-panel">
          <div className="sidebar-heading">
            <Filter size={18} color="var(--primary)" />
            <h2>Search & Filters</h2>
          </div>

          <form onSubmit={handleSearchSubmit} className="filter-form">
            
            {/* Search Input */}
            <div className="filter-group">
              <label>Search Keyword</label>
              <div className="filter-search-box">
                <input 
                  type="text" 
                  placeholder="Institute or Course..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
                <button type="submit"><SearchIcon size={16} /></button>
              </div>
            </div>

            {/* City Filter */}
            <div className="filter-group">
              <label>City Location</label>
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="filter-select">
                <option value="">All Cities</option>
                <option value="Pune">Pune</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Gurugram">Gurugram</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label>Subject Domain</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="filter-select">
                <option value="all">All Domains</option>
                <option value="programming">Programming & IT</option>
                <option value="datascience">Data Science & Analytics</option>
                <option value="design">UI/UX & Creative Design</option>
                <option value="cybersecurity">Cyber Security</option>
                <option value="cloudcomputing">Cloud Computing & DevOps</option>
                <option value="government">Government Exams (UPSC/Banking)</option>
              </select>
            </div>

            {/* Fee Max Slider */}
            <div className="filter-group">
              <div className="slider-label-row">
                <label>Maximum Fee</label>
                <strong>₹{feeMax.toLocaleString("en-IN")}</strong>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="100000" 
                step="5000"
                value={feeMax} 
                onChange={(e) => setFeeMax(parseInt(e.target.value))}
                className="filter-slider"
              />
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label>Minimum Rating</label>
              <div className="rating-select-row">
                {[0, 3, 4, 4.5].map(stars => (
                  <button 
                    type="button"
                    key={stars}
                    className={`rating-btn ${minRating === stars ? "active" : ""}`}
                    onClick={() => setMinRating(stars)}
                  >
                    {stars === 0 ? "Any" : `⭐ ${stars}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Timings/Weekend Toggle */}
            <div className="toggle-group">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={weekendOnly} 
                  onChange={(e) => setWeekendOnly(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span>Weekend Batches Only</span>
              </label>
            </div>

            {/* Placement Assistance Toggle */}
            <div className="toggle-group text-space">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={placementAssistance} 
                  onChange={(e) => setPlacementAssistance(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span>Placement Assistance Guaranteed</span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="filter-actions">
              <button type="submit" className="btn-primary w-full">Apply Search</button>
              <button type="button" onClick={handleClearFilters} className="btn-secondary w-full">Clear Filters</button>
            </div>

          </form>
        </aside>

        {/* Right Side: Main Listing Workspace & Map split */}
        <div className="main-classes-workspace">
          
          {/* Controls Bar */}
          <div className="workspace-controls-bar glass-panel">
            <span className="results-count">
              Found <strong>{institutes.length}</strong> Coaching Institutes
            </span>

            <div className="control-options">
              {/* Map Toggle */}
              <button 
                className={`control-btn ${showMap ? "active" : ""}`}
                onClick={() => setShowMap(!showMap)}
                title="Toggle Map View"
              >
                <Map size={16} />
                <span>Map Dashboard</span>
              </button>

              {/* View Toggle */}
              <div className="toggle-view-buttons">
                <button 
                  className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid Layout"
                >
                  <Grid size={16} />
                </button>
                <button 
                  className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List Layout"
                >
                  <ListIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Core Content: Split Map + List Layout */}
          <div className={`workspace-split ${showMap ? "with-map" : "no-map"}`}>
            
            {/* Split A: Institutes List */}
            <div className={`institutes-list-panel ${viewMode === "list" ? "list-layout" : "grid-layout"}`}>
              {loading ? (
                <div className="loading-state glass-panel">
                  <Compass className="animate-spin" size={40} color="var(--primary)" />
                  <p>Searching for nearby classes...</p>
                </div>
              ) : institutes.length > 0 ? (
                institutes.map(inst => (
                  <div 
                    key={inst.id} 
                    className={`institute-card glass-panel fade-in ${selectedInstId === inst.id ? "highlight-pin" : ""}`}
                    onMouseEnter={() => setSelectedInstId(inst.id)}
                    onMouseLeave={() => setSelectedInstId(null)}
                    onClick={() => navigate(`/institute/${inst.id}`)}
                  >
                    <div className="card-image-wrap">
                      <img src={inst.coverImage} alt={inst.name} className="card-cover-img" />
                      <div className="card-overlay-badge">Est. {inst.establishedYear}</div>
                      <button 
                        onClick={(e) => handleToggleSave(inst.id, e)}
                        className={`card-bookmark-btn ${isSaved(inst.id) ? "saved" : ""}`}
                      >
                        <Heart size={16} fill={isSaved(inst.id) ? "var(--error)" : "none"} />
                      </button>
                    </div>

                    <div className="card-body">
                      <div className="logo-title-row">
                        <img src={inst.logo} alt={inst.name} className="card-logo-img" />
                        <div className="title-section">
                          <h3>{inst.name}</h3>
                          <div className="location-row">
                            <MapPin size={12} color="var(--text-secondary)" />
                            <span>{inst.city}, {inst.state}</span>
                          </div>
                        </div>
                      </div>

                      <p className="card-desc">{inst.description}</p>

                      <div className="categories-row">
                        {inst.categories.map(cat => (
                          <span key={cat} className="category-tag">
                            {categoryLabels[cat] || cat}
                          </span>
                        ))}
                      </div>

                      {/* Summary Metrics */}
                      <div className="card-metrics-row">
                        <div className="rating-pill">
                          <Star size={14} fill="var(--primary)" color="var(--primary)" />
                          <strong>{inst.rating}</strong>
                          <span>({inst.reviewsCount} reviews)</span>
                        </div>
                        <div className="courses-count-pill">
                          <BookOpen size={14} />
                          <span>{inst.courses.length} Courses Offered</span>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="fee-starting">
                          <span>Starting from</span>
                          <strong>₹{inst.courses.length > 0 ? Math.min(...inst.courses.map(c => c.fees)).toLocaleString("en-IN") : "0"}</strong>
                        </div>
                        <button className="btn-secondary card-action-btn">
                          <span>View Profile</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-results-panel glass-panel">
                  <Compass size={48} color="var(--text-muted)" />
                  <h3>No Institutes Match Your Filters</h3>
                  <p>Try broadening your location search, increasing the max budget, or clearing categories.</p>
                  <button onClick={handleClearFilters} className="btn-primary">Reset All Filters</button>
                </div>
              )}
            </div>

            {/* Split B: Custom Interactive SVG Map Dashboard */}
            {showMap && (
              <div className="map-view-panel glass-panel">
                <div className="map-panel-header">
                  <Map size={16} color="var(--primary)" />
                  <h3>Interactive Hub Map</h3>
                </div>
                
                <div className="svg-map-wrapper">
                  <svg className="custom-vector-map" viewBox="0 0 800 600">
                    {/* Grid Background */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(29,92,255,0.05)" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Rivers / Decorative paths */}
                    <path d="M-50,300 Q150,150 400,280 T850,220" fill="none" stroke="rgba(29,92,255,0.1)" strokeWidth="24" strokeLinecap="round" />
                    <path d="M-50,300 Q150,150 400,280 T850,220" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6,4" />

                    {/* Major Area Zones */}
                    <circle cx="280" cy="180" r="100" fill="rgba(29,92,255,0.02)" stroke="rgba(29,92,255,0.05)" strokeDasharray="5,5" />
                    <text x="280" y="120" className="map-zone-text">Viman Nagar IT Zone</text>

                    <circle cx="450" cy="380" r="120" fill="rgba(144,85,255,0.02)" stroke="rgba(144,85,255,0.05)" strokeDasharray="5,5" />
                    <text x="450" y="440" className="map-zone-text">Sadashiv Government Center</text>

                    {/* Pune / Bangalore Roads */}
                    <line x1="100" y1="50" x2="700" y2="550" stroke="rgba(15,23,42,0.06)" strokeWidth="8" />
                    <line x1="100" y1="500" x2="700" y2="100" stroke="rgba(15,23,42,0.06)" strokeWidth="8" />

                    {/* Custom Geolocated Map Pins */}
                    {institutes.map((inst, index) => {
                      let cx = 400;
                      let cy = 300;

                      if (inst.id === "inst-1") { cx = 280; cy = 180; }
                      else if (inst.id === "inst-2") { cx = 450; cy = 380; }
                      else if (inst.id === "inst-3") { cx = 620; cy = 150; }
                      else if (inst.id === "inst-4") { cx = 180; cy = 450; }

                      const isSelected = selectedInstId === inst.id;

                      return (
                        <g 
                          key={inst.id}
                          className="map-pin-group"
                          onMouseEnter={() => setSelectedInstId(inst.id)}
                          onMouseLeave={() => setSelectedInstId(null)}
                          onClick={() => navigate(`/institute/${inst.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {/* Pulsing Outer Rings */}
                          {isSelected && (
                            <>
                              <circle cx={cx} cy={cy} r="25" fill="none" stroke="var(--primary)" strokeWidth="2" className="ping-ring-1" />
                              <circle cx={cx} cy={cy} r="40" fill="none" stroke="var(--primary)" strokeWidth="1" className="ping-ring-2" />
                            </>
                          )}
                          
                          {/* Pin Shadow */}
                          <ellipse cx={cx} cy={cy + 12} rx="8" ry="3" fill="rgba(15,23,42,0.15)" />

                          {/* Pin SVG Graphic */}
                          <path 
                            d={`M ${cx} ${cy} C ${cx - 8} ${cy - 12} ${cx - 12} ${cy - 20} ${cx} ${cy - 30} C ${cx + 12} ${cy - 20} ${cx + 8} ${cy - 12} ${cx} ${cy}`} 
                            fill={isSelected ? "var(--primary)" : "var(--accent-cyan)"}
                            stroke="#FFFFFF"
                            strokeWidth="2"
                          />
                          <circle cx={cx} cy={cy - 18} r="4" fill="#FFFFFF" />

                          {/* Floating Map tooltip */}
                          {isSelected && (
                            <foreignObject x={cx - 100} y={cy - 85} width="200" height="60">
                              <div className="map-tooltip-card glass-panel fade-in" style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 12px' }}>
                                <strong style={{ fontSize: '0.75rem', color: 'var(--text-primary)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inst.name}</strong>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>⭐ {inst.rating} • {inst.city}</span>
                              </div>
                            </foreignObject>
                          )}
                        </g>
                      );
                    })}

                  </svg>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .offline-classes-page {
          display: flex;
          flex-direction: column;
        }

        .classes-header {
          margin-bottom: 40px;
        }

        .classes-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 60%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
        }

        .classes-header p {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.5;
        }

        .classes-layout-container {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 36px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .classes-layout-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        /* Sidebar Filters */
        .filters-sidebar {
          padding: 24px;
          background: var(--bg-glass);
        }

        .sidebar-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 14px;
          margin-bottom: 20px;
        }

        .sidebar-heading h2 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .filter-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-group label {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .filter-search-box {
          display: flex;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 2px 4px 2px 12px;
        }

        .filter-search-box input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.85rem;
          width: 100%;
          outline: none;
          padding: 6px 0;
        }

        .filter-search-box button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
        }

        .filter-search-box button:hover {
          color: var(--primary);
        }

        .filter-select {
          padding: 8px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }

        .slider-label-row strong {
          color: var(--primary);
        }

        .filter-slider {
          width: 100%;
          accent-color: var(--primary);
          height: 6px;
          background: var(--border-color);
          border-radius: var(--radius-full);
          outline: none;
        }

        .rating-select-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .rating-btn {
          padding: 6px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .rating-btn:hover, .rating-btn.active {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-light);
        }

        /* Checkbox Toggles */
        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: pointer;
          user-select: none;
          font-weight: 600;
        }

        .checkbox-container input {
          display: none;
        }

        .checkmark {
          width: 16px;
          height: 16px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-secondary);
          display: inline-block;
          position: relative;
        }

        .checkbox-container input:checked ~ .checkmark {
          background: var(--primary);
          border-color: var(--primary);
        }

        .checkbox-container input:checked ~ .checkmark::after {
          content: "";
          position: absolute;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .text-space {
          margin-top: -4px;
        }

        .filter-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid var(--border-color);
          padding-top: 18px;
          margin-top: 6px;
        }

        /* Workspace Controls */
        .main-classes-workspace {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .workspace-controls-bar {
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .results-count {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .control-options {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 0.82rem;
          font-weight: 700;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .control-btn:hover, .control-btn.active {
          color: var(--primary);
          border-color: var(--primary);
          background: var(--primary-light);
        }

        .toggle-view-buttons {
          display: flex;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          overflow: hidden;
        }

        .toggle-btn {
          padding: 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .toggle-btn:hover, .toggle-btn.active {
          background: var(--primary);
          color: #FFFFFF;
        }

        /* Workspace Layout Split */
        .workspace-split {
          display: grid;
          gap: 28px;
          transition: all var(--transition-normal);
        }

        .workspace-split.with-map {
          grid-template-columns: 1fr 400px;
        }

        .workspace-split.no-map {
          grid-template-columns: 1fr;
        }

        @media (max-width: 1200px) {
          .workspace-split.with-map {
            grid-template-columns: 1fr;
          }
        }

        /* Grid / List Layouts */
        .institutes-list-panel {
          display: grid;
          gap: 24px;
        }

        .grid-layout {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (max-width: 768px) {
          .grid-layout {
            grid-template-columns: 1fr;
          }
        }

        .list-layout {
          grid-template-columns: 1fr;
        }

        /* Institute Card */
        .institute-card {
          overflow: hidden;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .institute-card:hover, .institute-card.highlight-pin {
          transform: translateY(-6px);
          border-color: rgba(29, 92, 255, 0.35);
          box-shadow: 
            0 20px 40px rgba(15, 23, 42, 0.04),
            0 0 25px rgba(29, 92, 255, 0.08);
        }

        .card-image-wrap {
          height: 140px;
          position: relative;
          width: 100%;
        }

        .card-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-overlay-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.85);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }

        .card-bookmark-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }

        .card-bookmark-btn:hover {
          transform: scale(1.1);
          color: var(--error);
        }

        .card-bookmark-btn.saved {
          color: var(--error);
          background: #FFFFFF;
        }

        .card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 12px;
        }

        .logo-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card-logo-img {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          object-fit: cover;
          background: #FFFFFF;
        }

        .title-section h3 {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .location-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .location-row span {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .card-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .categories-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .category-tag {
          font-size: 0.68rem;
          font-weight: 700;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }

        .card-metrics-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 10px 0;
          margin-top: 4px;
        }

        .rating-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
        }

        .rating-pill strong {
          color: var(--text-primary);
        }

        .rating-pill span {
          color: var(--text-muted);
        }

        .courses-count-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 700;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 4px;
        }

        .fee-starting {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .fee-starting span {
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .fee-starting strong {
          font-size: 1rem;
          color: var(--primary);
          font-weight: 800;
        }

        .card-action-btn {
          padding: 6px 12px;
          font-size: 0.78rem;
        }

        /* List layout modifications */
        .list-layout .institute-card {
          flex-direction: row;
          height: 180px;
        }

        .list-layout .card-image-wrap {
          width: 220px;
          height: 100%;
        }

        .list-layout .card-body {
          padding: 16px 20px;
        }

        .list-layout .card-footer {
          margin-top: 4px;
        }

        @media (max-width: 600px) {
          .list-layout .institute-card {
            flex-direction: column;
            height: auto;
          }
          .list-layout .card-image-wrap {
            width: 100%;
            height: 120px;
          }
        }

        /* Map Panel Styling */
        .map-view-panel {
          height: 580px;
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: column;
          background: var(--bg-glass);
          overflow: hidden;
          padding: 0;
        }

        .map-panel-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.4);
        }

        .map-panel-header h3 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .svg-map-wrapper {
          flex: 1;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
        }

        .custom-vector-map {
          width: 100%;
          height: 100%;
        }

        .map-zone-text {
          font-size: 0.68rem;
          font-weight: 700;
          fill: var(--text-muted);
          text-anchor: middle;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .map-tooltip-card {
          padding: 8px 12px;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          gap: 2px;
          pointer-events: none;
        }

        .map-tooltip-card strong {
          font-size: 0.75rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .map-tooltip-card span {
          font-size: 0.65rem;
          color: var(--text-secondary);
        }

        /* SVG Map Animation */
        .ping-ring-1 {
          animation: mapPulse 2s infinite ease-out;
          transform-origin: center;
        }

        .ping-ring-2 {
          animation: mapPulse 2s infinite ease-out;
          animation-delay: 0.8s;
          transform-origin: center;
        }

        @keyframes mapPulse {
          0% {
            transform: scale(0.4);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        /* Loading / Empty States */
        .loading-state {
          padding: 80px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          text-align: center;
          color: var(--text-secondary);
        }

        .empty-results-panel {
          padding: 60px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: var(--text-secondary);
        }

        .empty-results-panel h3 {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .empty-results-panel p {
          max-width: 400px;
          font-size: 0.88rem;
          line-height: 1.5;
          margin: 0;
        }
      `}} />
    </div>
  );
}
