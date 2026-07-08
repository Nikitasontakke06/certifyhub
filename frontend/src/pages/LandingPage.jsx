import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, CheckCircle, ArrowRight, Award, Compass, BookOpen, 
  Database, TrendingUp, Briefcase, Star, Code, Cpu, Shield, 
  Palette, Cloud, Layers, BarChart 
} from "lucide-react";
import CourseCard from "../components/CourseCard";

export default function LandingPage({ user, openAuth, courses = [], loading, onToggleCompare, compareList }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [showRecs, setShowRecs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Personalized recommendations
  const [personalizedRecs, setPersonalizedRecs] = useState([]);
  const [personalRecsLoading, setPersonalRecsLoading] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      setPersonalRecsLoading(true);
      fetch(`/api/recommendations?email=${encodeURIComponent(user.email)}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setPersonalizedRecs(data))
        .catch(err => console.error("Error loading recommendations:", err))
        .finally(() => setPersonalRecsLoading(false));
    } else {
      setPersonalizedRecs([]);
    }
  }, [user]);

  const interestsList = [
    { id: "datascience", label: "Data Science", category: "datascience", icon: <Database size={16} /> },
    { id: "programming", label: "Web Development", category: "programming", icon: <Code size={16} /> },
    { id: "aiml", label: "AI & ML", category: "aiml", icon: <Cpu size={16} /> },
    { id: "cybersecurity", label: "Cybersecurity", category: "cybersecurity", icon: <Shield size={16} /> },
    { id: "design", label: "UI/UX Design", category: "design", icon: <Palette size={16} /> },
    { id: "cloudcomputing", label: "Cloud & DevOps", category: "cloudcomputing", icon: <Cloud size={16} /> },
    { id: "business", label: "Project Management", category: "business", icon: <BarChart size={16} /> }
  ];

  const handleInterestToggle = (interestId) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId) 
        : [...prev, interestId]
    );
  };

  const handleGetRecommendations = () => {
    if (!user) {
      openAuth();
      return;
    }

    if (selectedInterests.length === 0) {
      setRecommendedCourses([]);
      setShowRecs(false);
      return;
    }

    const selectedCategories = interestsList
      .filter(item => selectedInterests.includes(item.id))
      .map(item => item.category);

    const filtered = courses.filter(course => 
      selectedCategories.includes(course.category)
    );

    setRecommendedCourses(filtered.slice(0, 3)); 
    setShowRecs(true);

    setTimeout(() => {
      document.getElementById("recommendations-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      openAuth();
      return;
    }
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="landing-page page-container">
      {/* Glowing background orbs with smooth breathing animations */}
      <div className="glowing-orb orb-1"></div>
      <div className="glowing-orb orb-2"></div>
      <div className="glowing-orb orb-3"></div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Left Column: Realistic Product Hook */}
          <div className="hero-content">
            <div className="hero-badge fade-in">
              <Award size={14} color="var(--primary)" />
              <span>India's Leading Certification Aggregator</span>
            </div>
            
            <h1 className="hero-title fade-in">
              Empower Your Career with <br />
              <span className="gradient-text-vibrant">The Right Certification</span>
            </h1>
            
            <p className="hero-subtitle fade-in">
              Compare syllabus matrices, student feedback, and real-time pricing across Udemy, Coursera, Swayam, Great Learning, and PW Skills. Connect learning pathways directly with daily hiring stats in India.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hero-search-form glass-panel fade-in">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search skills, tools, or providers... (e.g. Python, AWS, Swayam)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input"
              />
              <button type="submit" className="btn-primary search-submit-btn">
                <span>Compare Now</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Core Stats */}
            <div className="hero-stats fade-in">
              <div className="stat-box">
                <h3>5000+</h3>
                <p>Aggregated Courses</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box">
                <h3>6+</h3>
                <p>Global Providers</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box">
                <h3>â‚¹ INR</h3>
                <p>Localized Pricing</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup Showcase */}
          <div className="hero-visual fade-in" onClick={() => { if (!user) openAuth(); }}>
            <div className="visual-wrapper">
              {/* Tilted Card 1 (Udemy) */}
              <div className="mock-card mock-card-1 glass-panel">
                <div className="mock-image-container">
                  <img src="/python_thumbnail.png" alt="Python Programming" className="mock-image" />
                </div>
                <div className="mock-body">
                  <div className="mock-header">
                    <span className="mock-provider prov-udemy">Udemy</span>
                    <span className="mock-price">â‚¹1,499</span>
                  </div>
                  <h4>Complete Python Bootcamp</h4>
                  <div className="mock-meta">
                    <div className="rating">
                      <Star size={12} fill="var(--primary)" color="var(--primary)" />
                      <span>4.6 (485k reviews)</span>
                    </div>
                    <span className="badge">Best Seller</span>
                  </div>
                </div>
              </div>

              {/* Tilted Card 2 (Coursera) */}
              <div className="mock-card mock-card-2 glass-panel">
                <div className="mock-image-container">
                  <img src="/datascience_thumbnail.png" alt="Data Science" className="mock-image" />
                </div>
                <div className="mock-body">
                  <div className="mock-header">
                    <span className="mock-provider prov-coursera">Coursera</span>
                    <span className="mock-price">â‚¹3,299</span>
                  </div>
                  <h4>IBM Data Science Professional</h4>
                  <div className="mock-meta">
                    <div className="rating">
                      <Star size={12} fill="var(--primary)" color="var(--primary)" />
                      <span>4.8 (65k reviews)</span>
                    </div>
                    <span className="badge">Professional</span>
                  </div>
                </div>
              </div>

              {/* VS Comparison Badge */}
              <div className="vs-badge">VS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Platforms Strip */}
      <div className="partners-showcase-strip glass-panel fade-in" onClick={() => { if (!user) openAuth(); }}>
        <span className="strip-title">Supported Partners</span>
        <div className="logo-row">
          <span className="logo-item prov-udemy">Udemy</span>
          <span className="logo-item prov-coursera">Coursera</span>
          <span className="logo-item prov-gl">Great Learning</span>
          <span className="logo-item prov-simplilearn">Simplilearn</span>
          <span className="logo-item prov-pw">PW Skills</span>
          <span className="logo-item prov-swayam">Swayam</span>
        </div>
      </div>

      {/* Why Choose Showcase (Realistic, User-Focused Features) */}
      <section className="why-section fade-in" onClick={() => { if (!user) openAuth(); }}>
        <div className="section-header">
          <TrendingUp size={24} color="var(--primary)" />
          <h2>Smart Comparison features</h2>
        </div>
        <p className="section-subtitle">
          Engineered to give you objective data points for choosing your next certification.
        </p>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Layers size={24} />
            </div>
            <h3>Side-by-Side Comparison</h3>
            <p>
              Instantly overlay syllabi coverage, learning hours, verified ratings, and regional Indian Rupee pricing options from different sites.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Briefcase size={24} />
            </div>
            <h3>Active Job Market Link</h3>
            <p>
              Cross-reference curriculum paths directly with current active job openings in India, average LPA scales, and technical competencies.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Star size={24} />
            </div>
            <h3>Daily Trend Recalculator</h3>
            <p>
              Stay updated on emerging career roles. Our index continuously fetches job growth statistics and popularity scores daily.
            </p>
          </div>
        </div>
      </section>

      {/* Personalized Profile Recommendations Section */}
      {user && (
        <section className="personalized-recs-section fade-in">
          <div className="section-header">
            <Award size={24} color="var(--primary)" />
            <h2>Recommended for You</h2>
          </div>
          <p className="section-subtitle">
            Dynamic course recommendations customized for your profile level and budget limits.
          </p>

          <div className="recs-grid" style={{ marginTop: 24 }}>
            {personalRecsLoading ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>
                <div className="loading-spinner"></div>
                <p style={{ marginTop: 12 }}>Connecting to database, loading recommendations...</p>
              </div>
            ) : personalizedRecs.length > 0 ? (
              personalizedRecs.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isCompared={compareList.some(item => item.id === course.id)}
                  onToggleCompare={onToggleCompare}
                />
              ))
            ) : (
              <div className="no-recs glass-panel" style={{ width: "100%", padding: 24, textAlign: "center" }}>
                <p>No courses match your profile preferences. Try updating your profile interests or budget!</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Select Interests Form with icons */}
      <section className="interests-section glass-panel fade-in">
        <div className="section-header">
          <Compass size={24} color="var(--primary)" />
          <h2>Select Your Career Interests</h2>
        </div>
        <p className="section-subtitle">
          Choose one or more domains to get recommendations from leading providers.
        </p>

        <div className="interests-grid">
          {interestsList.map(interest => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <button
                key={interest.id}
                onClick={() => handleInterestToggle(interest.id)}
                className={`interest-badge-btn glass-panel ${isSelected ? "selected" : ""}`}
              >
                <div className="checkbox-indicator">
                  {isSelected && <CheckCircle size={16} fill="var(--primary)" color="#ffffff" />}
                </div>
                <span className="interest-icon-box">{interest.icon}</span>
                <span>{interest.label}</span>
              </button>
            );
          })}
        </div>

        <div className="interests-action">
          <button 
            onClick={handleGetRecommendations}
            className="btn-primary get-recs-btn"
            disabled={selectedInterests.length === 0}
          >
            <span>Get Personalized Courses</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Dynamic Recommended Courses Grid */}
      {showRecs && (
        <section id="recommendations-section" className="recs-section fade-in">
          <div className="section-header">
            <BookOpen size={24} color="var(--primary)" />
            <h2>Recommended for You</h2>
          </div>
          <p className="section-subtitle">
            Based on your interests, here are the top-rated certification courses available.
          </p>

          <div className="recs-grid">
            {loading ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>
                <div className="loading-spinner"></div>
                <p style={{ marginTop: 12 }}>Connecting to database, loading recommendations...</p>
              </div>
            ) : recommendedCourses.length > 0 ? (
              recommendedCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isCompared={compareList.some(item => item.id === course.id)}
                  onToggleCompare={onToggleCompare}
                />
              ))
            ) : (
              <div className="no-recs glass-panel">
                <p>No courses match your exact selection. Try selecting other interests!</p>
              </div>
            )}
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .landing-page {
          display: flex;
          flex-direction: column;
          gap: 80px;
          position: relative;
        }

        /* Glowing Orbs with realistic floating keyframes */
        .glowing-orb {
          position: absolute;
          width: 550px;
          height: 550px;
          border-radius: 50%;
          z-index: -1;
          pointer-events: none;
          opacity: 0.22;
          filter: blur(140px);
        }

        .orb-1 {
          background: radial-gradient(circle, var(--primary) 0%, rgba(29, 92, 255, 0) 70%);
          top: 0%;
          left: 10%;
          animation: floatOrb1 18s infinite ease-in-out;
        }

        .orb-2 {
          background: radial-gradient(circle, #8f00ff 0%, rgba(143, 0, 255, 0) 70%);
          top: 35%;
          right: 5%;
          animation: floatOrb2 22s infinite ease-in-out;
        }

        .orb-3 {
          background: radial-gradient(circle, var(--accent-purple) 0%, rgba(124, 60, 255, 0) 70%);
          top: 15%;
          left: 45%;
          width: 400px;
          height: 400px;
          opacity: 0.15;
          animation: floatOrb1 14s infinite ease-in-out alternate;
        }

        @keyframes floatOrb1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes floatOrb2 {
          0% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(40px, -30px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1.1); }
        }

        /* Hero Section Styling */
        .hero-section {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 60px 0 20px 0;
          width: 100%;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 80px;
          align-items: center;
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          text-align: left;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 28px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--primary-light);
          color: var(--primary);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid rgba(29, 92, 255, 0.25);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .gradient-text-vibrant {
          background: linear-gradient(135deg, var(--text-primary) 10%, var(--primary) 70%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.65;
          max-width: 620px;
        }

        .hero-search-form {
          width: 100%;
          max-width: 580px;
          display: flex;
          align-items: center;
          padding: 6px 6px 6px 20px;
          border-radius: var(--radius-lg);
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
        }

        .hero-search-form:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-light), var(--shadow-lg);
        }

        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .hero-search-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 1rem;
          width: 100%;
          outline: none;
          padding: 12px;
        }

        .search-submit-btn {
          padding: 12px 24px;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          flex-shrink: 0;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .stat-box h3 {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .stat-box p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }

        /* Hero Visual Comparison Card Stack */
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          height: 380px;
          width: 100%;
          cursor: pointer;
        }

        .visual-wrapper {
          position: relative;
          width: 360px;
          height: 280px;
        }

        .mock-card {
          position: absolute;
          width: 270px;
          padding: 0;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-glass);
          border: 1px solid rgba(29, 92, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .mock-card-1 {
          top: -30px;
          left: -20px;
          transform: rotate(-5deg);
          z-index: 2;
        }

        .mock-card-2 {
          bottom: -30px;
          right: -20px;
          transform: rotate(5deg);
          z-index: 1;
        }

        .mock-card:hover {
          transform: scale(1.05) translateY(-10px) rotate(0deg);
          z-index: 4;
          border-color: var(--primary);
          box-shadow: 0 25px 50px rgba(29, 92, 255, 0.18);
        }

        .mock-image-container {
          width: 100%;
          height: 115px;
          overflow: hidden;
          position: relative;
          border-bottom: 1px solid rgba(148, 163, 184, 0.16);
        }

        .mock-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .mock-card:hover .mock-image {
          transform: scale(1.06);
        }

        .mock-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .mock-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .mock-provider {
          font-size: 0.8rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .prov-udemy { background: rgba(164, 53, 240, 0.15); color: #c084fc; }
        .prov-coursera { background: rgba(0, 86, 210, 0.15); color: #60a5fa; }

        .mock-price {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .mock-card h4 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          text-align: left;
        }

        .mock-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .mock-meta .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .mock-meta .badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--primary);
          background: var(--primary-light);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(29, 92, 255, 0.15);
        }

        .vs-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--accent-purple));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
          border: 3px solid var(--bg-primary);
          box-shadow: 0 0 20px rgba(29, 92, 255, 0.6);
          z-index: 3;
          animation: pulseVS 2s infinite ease-in-out;
        }

        @keyframes pulseVS {
          0% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 15px rgba(29, 92, 255, 0.6); }
          50% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 25px rgba(29, 92, 255, 0.8); }
          100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 15px rgba(29, 92, 255, 0.6); }
        }

        /* Supported Platforms Strip */
        .partners-showcase-strip {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 28px 32px;
          align-items: center;
          justify-content: center;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          cursor: pointer;
          max-width: 1300px;
          margin: 0 auto;
          width: 100%;
        }

        .strip-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .logo-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 48px;
          align-items: center;
          width: 100%;
        }

        .logo-item {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: -0.02em;
          transition: all var(--transition-normal);
          cursor: default;
        }

        .logo-item:hover {
          color: var(--text-primary);
          transform: translateY(-2px) scale(1.05);
        }

        .logo-item.prov-udemy:hover { text-shadow: 0 0 12px rgba(164, 53, 240, 0.6); }
        .logo-item.prov-coursera:hover { text-shadow: 0 0 12px rgba(0, 86, 210, 0.6); }
        .logo-item.prov-gl:hover { text-shadow: 0 0 12px rgba(0, 186, 124, 0.6); }
        .logo-item.prov-simplilearn:hover { text-shadow: 0 0 12px rgba(29, 92, 255, 0.6); }
        .logo-item.prov-pw:hover { text-shadow: 0 0 12px rgba(0, 200, 255, 0.6); }
        .logo-item.prov-swayam:hover { text-shadow: 0 0 12px rgba(255, 215, 0, 0.6); }

        /* Why CertifyHub Showcase */
        .why-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          cursor: pointer;
          max-width: 1300px;
          margin: 0 auto;
          width: 100%;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 16px;
        }

        .feature-card {
          padding: 32px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 18px;
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .feature-card:hover::before {
          transform: translateX(100%);
        }

        .feature-card:hover {
          transform: translateY(-6px);
          border-color: var(--primary);
          box-shadow: 0 12px 30px rgba(29, 92, 255, 0.08);
        }

        .feature-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          border: 1px solid rgba(29, 92, 255, 0.2);
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .feature-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Interest Selection Styling */
        .interests-section {
          padding: 48px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          max-width: 1300px;
          margin: 0 auto;
          width: 100%;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .section-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .section-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 28px;
        }

        .interests-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .interest-badge-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.72);
          border-radius: var(--radius-md);
          cursor: pointer;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-normal);
        }

        .interest-badge-btn:hover {
          background: rgba(29, 92, 255, 0.03);
          border-color: rgba(29, 92, 255, 0.25);
          color: var(--text-primary);
          transform: scale(1.02);
        }

        .interest-badge-btn.selected {
          background: var(--primary-light);
          border-color: var(--primary);
          color: var(--text-primary);
          box-shadow: 0 0 20px rgba(29, 92, 255, 0.15);
        }

        .interest-icon-box {
          display: flex;
          align-items: center;
          color: var(--primary);
          opacity: 0.8;
          transition: color var(--transition-fast);
        }

        .interest-badge-btn.selected .interest-icon-box {
          color: var(--text-primary);
        }

        .checkbox-indicator {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.78);
          transition: all var(--transition-fast);
        }

        .interest-badge-btn.selected .checkbox-indicator {
          border-color: var(--primary);
          background: transparent;
        }

        .interests-action {
          display: flex;
          justify-content: center;
        }

        .get-recs-btn {
          padding: 14px 32px;
          font-size: 1rem;
          border-radius: var(--radius-md);
        }

        .get-recs-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: var(--bg-tertiary);
          box-shadow: none;
        }

        /* Recommendations Section */
        .recs-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 1300px;
          margin: 0 auto;
          width: 100%;
        }

        .recs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .no-recs {
          grid-column: 1 / -1;
          padding: 40px;
          text-align: center;
          color: var(--text-secondary);
        }

        @media (max-width: 992px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }
          .hero-content {
            align-items: center;
          }
          .hero-search-form {
            max-width: 650px;
          }
        }

        @media (max-width: 768px) {
          .landing-page {
            gap: 48px;
          }
          .hero-title {
            font-size: 2.75rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .hero-stats {
            flex-direction: column;
            gap: 16px;
          }
          .stat-divider {
            display: none;
          }
          .logo-row {
            gap: 24px;
          }
          .logo-item {
            font-size: 1.1rem;
          }
          .interests-section {
            padding: 24px;
          }
          .glowing-orb {
            width: 300px;
            height: 300px;
          }
        }
      `}} />
    </div>
  );
}
