import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, CheckCircle, ArrowRight, Award, Compass, BookOpen, Users } from "lucide-react";
import CourseCard from "../components/CourseCard";
import { COURSES_DATA } from "../data/mockData";

export default function LandingPage({ onToggleCompare, compareList }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [showRecs, setShowRecs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const interestsList = [
    { id: "datascience", label: "Data Science", category: "datascience" },
    { id: "programming", label: "Web Development / Programming", category: "programming" },
    { id: "aiml", label: "AI & ML", category: "aiml" },
    { id: "cybersecurity", label: "Cybersecurity", category: "cybersecurity" },
    { id: "design", label: "UI/UX Design", category: "design" }
  ];

  const handleInterestToggle = (interestId) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId) 
        : [...prev, interestId]
    );
  };

  const handleGetRecommendations = () => {
    if (selectedInterests.length === 0) {
      setRecommendedCourses([]);
      setShowRecs(false);
      return;
    }

    // Filter mock data based on categories
    const selectedCategories = interestsList
      .filter(item => selectedInterests.includes(item.id))
      .map(item => item.category);

    const filtered = COURSES_DATA.filter(course => 
      selectedCategories.includes(course.category)
    );

    setRecommendedCourses(filtered.slice(0, 3)); // show top 3 recommended
    setShowRecs(true);

    // Smooth scroll to recommendations
    setTimeout(() => {
      document.getElementById("recommendations-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="landing-page page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge fade-in">
            <Award size={14} color="var(--primary)" />
            <span>#1 Certification Aggregator</span>
          </div>
          <h1 className="hero-title fade-in">
            Certification... <br />
            <span className="gradient-text">Where Knowledge Meets Opportunity!</span>
          </h1>
          <p className="hero-subtitle fade-in">
            Compare prices, ratings, and course details across top educational platforms like Udemy, Coursera, and Great Learning. Find the right program to elevate your career.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hero-search-form glass-panel fade-in">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="What skill do you want to master today? (e.g. Python, UX, AI...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="btn-primary search-submit-btn">
              <span>Find Courses</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Core Stats */}
          <div className="hero-stats fade-in">
            <div className="stat-box">
              <h3>50+</h3>
              <p>Top Courses</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <h3>3+</h3>
              <p>Global Providers</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <h3>100%</h3>
              <p>Verified Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Select Interests Form */}
      <section className="interests-section glass-panel">
        <div className="section-header">
          <Compass size={24} color="var(--primary)" />
          <h2>Select Your Interests</h2>
        </div>
        <p className="section-subtitle">
          Tell us what you want to learn, and we'll suggest the highest-rated certifications to get you started.
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
                  {isSelected && <CheckCircle size={16} fill="var(--primary)" color="white" />}
                </div>
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
            <span>Get Recommended Courses</span>
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
            {recommendedCourses.length > 0 ? (
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
          gap: 60px;
        }

        /* Hero Section Styling */
        .hero-section {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
          text-align: center;
          padding: 40px 0;
        }

        .hero-content {
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
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
          border: 1px solid rgba(255, 115, 0, 0.25);
        }

        .hero-title {
          font-size: 3.25rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.03em;
        }

        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 680px;
        }

        .hero-search-form {
          width: 100%;
          max-width: 650px;
          display: flex;
          align-items: center;
          padding: 6px 6px 6px 20px;
          border-radius: var(--radius-lg);
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-color);
          margin-top: 10px;
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
          margin-top: 20px;
        }

        .stat-box h3 {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
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

        /* Interest Selection Styling */
        .interests-section {
          padding: 40px;
          background: rgba(22, 24, 32, 0.5);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .section-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
        }

        .section-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 32px;
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
          background: rgba(0, 0, 0, 0.2);
          border-radius: var(--radius-md);
          cursor: pointer;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-normal);
        }

        .interest-badge-btn:hover {
          background: rgba(255, 115, 0, 0.03);
          border-color: rgba(255, 115, 0, 0.25);
          color: #fff;
        }

        .interest-badge-btn.selected {
          background: var(--primary-light);
          border-color: var(--primary);
          color: #fff;
          box-shadow: 0 0 15px rgba(255, 115, 0, 0.1);
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
          background: rgba(0, 0, 0, 0.3);
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
          padding: 14px 28px;
          font-size: 1rem;
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

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.25rem;
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
          .interests-section {
            padding: 24px;
          }
        }
      `}} />
    </div>
  );
}
