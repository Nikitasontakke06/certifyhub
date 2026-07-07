import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Search, RefreshCw, X } from "lucide-react";
import CourseCard from "../components/CourseCard";
import { COURSES_DATA, CATEGORIES } from "../data/mockData";

export default function CoursesPage({ onToggleCompare, compareList }) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [priceFilter, setPriceFilter] = useState("all"); // "all" | "free" | "paid"
  const [sortBy, setSortBy] = useState("rating"); // "rating" | "price-asc" | "price-desc" | "reviews"
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Load URL parameters on mount / change
  useEffect(() => {
    const catParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (catParam) {
      const match = CATEGORIES.some(c => c.id === catParam);
      if (match) setActiveCategory(catParam);
    } else {
      setActiveCategory("all");
    }

    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...COURSES_DATA];

    // 1. Category Filter
    if (activeCategory !== "all") {
      result = result.filter(course => course.category === activeCategory);
    }

    // 2. Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
      );
    }

    // 3. Provider Filter
    if (selectedProviders.length > 0) {
      result = result.filter(course => selectedProviders.includes(course.provider));
    }

    // 4. Price Filter
    if (priceFilter === "free") {
      result = result.filter(course => course.price === 0);
    } else if (priceFilter === "paid") {
      result = result.filter(course => course.price > 0);
    }

    // 5. Sorting
    result.sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "reviews") {
        return b.reviewsCount - a.reviewsCount;
      }
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      return 0;
    });

    setFilteredCourses(result);
  }, [activeCategory, searchQuery, selectedProviders, priceFilter, sortBy]);

  const handleProviderToggle = (provider) => {
    setSelectedProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSelectedProviders([]);
    setPriceFilter("all");
    setSortBy("rating");
    setSearchParams({});
  };

  return (
    <div className="courses-page page-container">
      <div className="courses-header fade-in">
        <h1>Explore Certification Courses</h1>
        <p>Compare ratings, platform offerings, and pricing options to choose the right syllabus.</p>
      </div>

      <div className="courses-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar glass-panel fade-in">
          <div className="sidebar-header">
            <div className="header-title">
              <SlidersHorizontal size={18} color="var(--primary)" />
              <h3>Filters</h3>
            </div>
            <button onClick={handleResetFilters} className="reset-filters-btn" title="Reset all filters">
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="filter-section">
            <h4 className="filter-title">Search</h4>
            <div className="filter-search-box">
              <Search className="search-box-icon" size={16} />
              <input
                type="text"
                placeholder="Search by keywords..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Remove search param if user deletes query manually
                  if (!e.target.value) {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("search");
                    setSearchParams(newParams);
                  }
                }}
                className="filter-search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("search");
                    setSearchParams(newParams);
                  }} 
                  className="search-clear-btn"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Providers Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Platforms</h4>
            <div className="checkbox-list">
              {["Udemy", "Coursera", "Great Learning"].map(provider => {
                const isChecked = selectedProviders.includes(provider);
                return (
                  <label key={provider} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleProviderToggle(provider)}
                      className="styled-checkbox"
                    />
                    <span className="checkbox-custom"></span>
                    <span className="label-text">{provider}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Pricing</h4>
            <div className="radio-list">
              {[
                { id: "all", label: "All Prices" },
                { id: "free", label: "Free Courses" },
                { id: "paid", label: "Paid Courses" }
              ].map(opt => (
                <label key={opt.id} className="radio-label">
                  <input
                    type="radio"
                    name="price"
                    value={opt.id}
                    checked={priceFilter === opt.id}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="styled-radio"
                  />
                  <span className="radio-custom"></span>
                  <span className="label-text">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Section */}
        <main className="courses-main">
          {/* Categories Tab Bar */}
          <div className="categories-tabs glass-panel fade-in">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  const newParams = new URLSearchParams(searchParams);
                  if (category.id === "all") {
                    newParams.delete("category");
                  } else {
                    newParams.set("category", category.id);
                  }
                  setSearchParams(newParams);
                }}
                className={`tab-btn ${activeCategory === category.id ? "active" : ""}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Grid Info & Sorting */}
          <div className="grid-controls fade-in">
            <span className="courses-count">
              Found <strong>{filteredCourses.length}</strong> {filteredCourses.length === 1 ? "course" : "courses"}
            </span>

            <div className="sort-box">
              <label htmlFor="sort-select">Sort By:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select glass-panel"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="courses-grid-layout">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isCompared={compareList.some(item => item.id === course.id)}
                  onToggleCompare={onToggleCompare}
                />
              ))
            ) : (
              <div className="no-courses-found glass-panel fade-in">
                <Filter size={32} color="var(--text-muted)" />
                <h3>No courses found</h3>
                <p>We couldn't find any courses matching your filters. Try resetting them or changing your search terms.</p>
                <button onClick={handleResetFilters} className="btn-primary reset-btn">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .courses-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .courses-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }

        .courses-header p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .courses-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
          align-items: start;
        }

        /* Sidebar Filter Styling */
        .filters-sidebar {
          padding: 24px;
          background: rgba(22, 24, 32, 0.5);
          position: sticky;
          top: 100px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-title h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
        }

        .reset-filters-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .reset-filters-btn:hover {
          color: var(--primary);
        }

        .filter-section {
          margin-bottom: 24px;
        }

        .filter-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .filter-search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-box-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }

        .filter-search-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 10px 32px 10px 36px;
          font-size: 0.85rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .filter-search-input:focus {
          border-color: var(--primary);
        }

        .search-clear-btn {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-clear-btn:hover {
          color: #fff;
        }

        .checkbox-list, .radio-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Checkbox Custom Styles */
        .checkbox-label, .radio-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--text-secondary);
          position: relative;
          user-select: none;
        }

        .checkbox-label:hover, .radio-label:hover {
          color: #fff;
        }

        .styled-checkbox, .styled-radio {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .styled-checkbox:checked ~ .checkbox-custom {
          background: var(--primary);
          border-color: var(--primary);
        }

        .checkbox-custom::after {
          content: "";
          display: none;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg) translate(-1px, -1px);
        }

        .styled-checkbox:checked ~ .checkbox-custom::after {
          display: block;
        }

        /* Radio Custom Styles */
        .radio-custom {
          width: 18px;
          height: 18px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .styled-radio:checked ~ .radio-custom {
          border-color: var(--primary);
        }

        .radio-custom::after {
          content: "";
          display: none;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: var(--radius-full);
        }

        .styled-radio:checked ~ .radio-custom::after {
          display: block;
        }

        /* Tabs and Main Area Styling */
        .courses-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .categories-tabs {
          display: flex;
          flex-wrap: wrap;
          padding: 6px;
          background: rgba(22, 24, 32, 0.3);
          gap: 4px;
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.85rem;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tab-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }

        .tab-btn.active {
          background: var(--primary);
          color: white;
        }

        .grid-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .courses-count {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .courses-count strong {
          color: #fff;
        }

        .sort-box {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .sort-select {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 6px 12px;
          color: #fff;
          outline: none;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .courses-grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .no-courses-found {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 40px;
          background: rgba(22, 24, 32, 0.4);
        }

        .no-courses-found h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .no-courses-found p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          max-width: 420px;
          margin-bottom: 24px;
        }

        .reset-btn {
          font-size: 0.85rem;
        }

        @media (max-width: 992px) {
          .courses-layout {
            grid-template-columns: 1fr;
          }
          .filters-sidebar {
            position: static;
          }
        }
      `}} />
    </div>
  );
}
