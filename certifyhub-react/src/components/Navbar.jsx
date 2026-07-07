import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronDown, User, LogOut, BookOpen, Briefcase, Info } from "lucide-react";

export default function Navbar({ user, onLogout, openAuth }) {
  const [searchVal, setSearchVal] = useState("");
  const [coursesDropdown, setCoursesDropdown] = useState(false);
  const [trendingsDropdown, setTrendingsDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      openAuth();
      return;
    }
    if (searchVal.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchVal)}`);
      setSearchVal("");
    }
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content glass-panel">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">CH</span>
          <span className="logo-text">Certify<span style={{ color: "var(--primary)" }}>Hub</span></span>
        </Link>

        {/* Menu Items */}
        <ul className="navbar-menu">
          <li>
            <Link to="/" className="menu-link">
              <span>HOME</span>
            </Link>
          </li>
          
          <li 
            className="menu-item-dropdown"
            onMouseEnter={() => setCoursesDropdown(true)}
            onMouseLeave={() => setCoursesDropdown(false)}
          >
            <Link to="/courses" className="menu-link" onClick={(e) => {
              if (!user) {
                e.preventDefault();
                openAuth();
              } else {
                setCoursesDropdown(!coursesDropdown);
              }
            }}>
              <BookOpen size={16} />
              <span>COURSES</span>
              <ChevronDown size={14} className={coursesDropdown ? "rotated" : ""} />
            </Link>
            {coursesDropdown && (
              <div className="dropdown-menu glass-panel fade-in">
                <Link to="/courses?category=programming" className="dropdown-item" onClick={(e) => { if (!user) { e.preventDefault(); openAuth(); } else { setCoursesDropdown(false); } }}>Programming</Link>
                <Link to="/courses?category=datascience" className="dropdown-item" onClick={(e) => { if (!user) { e.preventDefault(); openAuth(); } else { setCoursesDropdown(false); } }}>Data Science</Link>
                <Link to="/courses?category=design" className="dropdown-item" onClick={(e) => { if (!user) { e.preventDefault(); openAuth(); } else { setCoursesDropdown(false); } }}>UI/UX & Design</Link>
                <Link to="/courses?category=cybersecurity" className="dropdown-item" onClick={(e) => { if (!user) { e.preventDefault(); openAuth(); } else { setCoursesDropdown(false); } }}>Cyber Security</Link>
                <Link to="/courses?category=aiml" className="dropdown-item" onClick={(e) => { if (!user) { e.preventDefault(); openAuth(); } else { setCoursesDropdown(false); } }}>AI & ML</Link>
                <Link to="/courses?category=cloudcomputing" className="dropdown-item" onClick={(e) => { if (!user) { e.preventDefault(); openAuth(); } else { setCoursesDropdown(false); } }}>Cloud & DevOps</Link>
                <Link to="/courses?category=business" className="dropdown-item" onClick={(e) => { if (!user) { e.preventDefault(); openAuth(); } else { setCoursesDropdown(false); } }}>Project Management</Link>
              </div>
            )}
          </li>

          <li 
            className="menu-item-dropdown"
            onMouseEnter={() => setTrendingsDropdown(true)}
            onMouseLeave={() => setTrendingsDropdown(false)}
          >
            <span className="menu-link" style={{ cursor: "pointer" }} onClick={() => setTrendingsDropdown(!trendingsDropdown)}>
              <Briefcase size={16} />
              <span>TRENDINGS</span>
              <ChevronDown size={14} className={trendingsDropdown ? "rotated" : ""} />
            </span>
            {trendingsDropdown && (
              <div className="dropdown-menu glass-panel fade-in">
                <Link to="/jobs" className="dropdown-item" onClick={(e) => { if (!user) { e.preventDefault(); openAuth(); } else { setTrendingsDropdown(false); } }}>Jobs</Link>
                <Link to="/courses?sort=reviews" className="dropdown-item" onClick={(e) => { if (!user) { e.preventDefault(); openAuth(); } else { setTrendingsDropdown(false); } }}>Trending Courses</Link>
              </div>
            )}
          </li>

          <li>
            <Link to="/about" className="menu-link">
              <Info size={16} />
              <span>ABOUT US</span>
            </Link>
          </li>
        </ul>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="navbar-search">
          <input
            type="text"
            placeholder="Search certifications..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <Search size={16} />
          </button>
        </form>

        {/* User Auth Info */}
        <div className="navbar-user">
          {user ? (
            <div className="user-profile">
              <span className="user-email" title={user.email}>{user.email}</span>
              <button onClick={onLogout} className="btn-logout" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={openAuth} className="btn-primary auth-trigger-btn">
              <User size={16} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 16px 24px;
        }

        .navbar-content {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          border-radius: var(--radius-md);
          background: rgba(13, 14, 18, 0.7);
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: -0.02em;
        }

        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary) 0%, #ff5500 100%);
          color: white;
          width: 32px;
          height: 32px;
          font-size: 0.9rem;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(255, 115, 0, 0.3);
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 6px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .menu-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .menu-link:hover, .menu-link:focus {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .menu-item-dropdown {
          position: relative;
        }

        .menu-item-dropdown .menu-link svg:last-child {
          transition: transform var(--transition-fast);
        }

        .menu-item-dropdown:hover .menu-link svg:last-child {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 200px;
          padding: 8px;
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 100;
          background: var(--bg-secondary);
        }

        .dropdown-menu::before {
          content: "";
          position: absolute;
          top: -12px;
          left: 0;
          width: 100%;
          height: 12px;
          background: transparent;
        }

        .dropdown-item {
          padding: 8px 12px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .dropdown-item:hover {
          color: #fff;
          background: var(--primary-light);
          padding-left: 16px;
        }

        .navbar-search {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          padding: 2px 4px 2px 14px;
          width: 260px;
          transition: all var(--transition-fast);
        }

        .navbar-search:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-light);
          width: 300px;
        }

        .search-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.85rem;
          width: 100%;
          outline: none;
        }

        .search-button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
        }

        .search-button:hover {
          color: var(--primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .navbar-user {
          display: flex;
          align-items: center;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          padding: 6px 6px 6px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .user-email {
          font-size: 0.85rem;
          color: var(--text-primary);
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 500;
        }

        .btn-logout {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .btn-logout:hover {
          color: var(--error);
          background: rgba(239, 68, 68, 0.08);
        }

        .auth-trigger-btn {
          padding: 8px 16px;
          font-size: 0.85rem;
        }

        /* Rotated chevron helper */
        .rotated {
          transform: rotate(180deg);
        }
      `}} />
    </nav>
  );
}
