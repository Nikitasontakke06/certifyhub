import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Settings, History, Save, Lock, Bell, Eye, EyeOff,
  CheckCircle, Sliders, Shield, Database, Code, 
  Cpu, ShieldAlert, Palette, Cloud, BarChart2, Check, RefreshCw
} from "lucide-react";

export default function ProfilePage({ user, onLoadComparison }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "settings" | "history"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Tab 1: Edit Profile Preferences State
  const [preferredDomains, setPreferredDomains] = useState([]);
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [budgetLimit, setBudgetLimit] = useState(10000);
  const [preferredPlatforms, setPreferredPlatforms] = useState([]);

  // Tab 2: Settings State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Tab 3: History State
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Domains/Categories list
  const domainsList = [
    { id: "programming", label: "Programming", icon: <Code size={16} /> },
    { id: "datascience", label: "Data Science", icon: <Database size={16} /> },
    { id: "design", label: "UI/UX & Design", icon: <Palette size={16} /> },
    { id: "cybersecurity", label: "Cyber Security", icon: <Shield size={16} /> },
    { id: "aiml", label: "AI & ML", icon: <Cpu size={16} /> },
    { id: "cloudcomputing", label: "Cloud & DevOps", icon: <Cloud size={16} /> },
    { id: "business", label: "Project Management", icon: <BarChart2 size={16} /> }
  ];

  // Platforms list
  const platformsList = [
    "Udemy", "Coursera", "Great Learning", "PW Skills", "Simplilearn", 
    "Swayam", "Scrimba", "DataCamp", "Interaction Design Foundation", 
    "Hack Design", "INE", "TryHackMe", "fast.ai", "HubSpot Academy", 
    "KodeKloud", "PMI"
  ];

  // Redirect to login if user not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Load preferences and history
  useEffect(() => {
    if (user && user.email) {
      fetchPreferences();
      fetchHistory();
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const fetchPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setPreferredDomains(data.preferredDomains || []);
        setSkillLevel(data.skillLevel || "Beginner");
        setBudgetLimit(data.budgetLimit !== undefined ? data.budgetLimit : 10000);
        setPreferredPlatforms(data.preferredPlatforms || []);
        setEmailNotifications(data.emailNotifications !== undefined ? data.emailNotifications : true);
      }
    } catch (err) {
      console.error("Failed to fetch preferences", err);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/comparison-history?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDomainToggle = (domainId) => {
    setPreferredDomains(prev => 
      prev.includes(domainId) 
        ? prev.filter(id => id !== domainId) 
        : [...prev, domainId]
    );
  };

  const handlePlatformToggle = (platform) => {
    setPreferredPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          preferredDomains,
          skillLevel,
          budgetLimit,
          preferredPlatforms,
          emailNotifications
        })
      });
      if (res.ok) {
        showMessage("success", "Preferences saved successfully!");
      } else {
        const data = await res.json();
        showMessage("error", data.error || "Failed to save preferences");
      }
    } catch (err) {
      showMessage("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showMessage("error", "New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          currentPassword,
          newPassword
        })
      });
      if (res.ok) {
        showMessage("success", "Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        showMessage("error", data.error || "Failed to update password");
      }
    } catch (err) {
      showMessage("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadHistoryComparison = (courses) => {
    if (!courses || courses.length === 0) return;
    onLoadComparison(courses);
    navigate("/compare");
  };

  if (!user) return null;

  return (
    <div className="profile-page-container page-container">
      <div className="glowing-orb orb-1"></div>
      <div className="glowing-orb orb-2"></div>

      <div className="profile-header fade-in">
        <h1>Profile Dashboard</h1>
        <p>Manage your learning preferences, settings, and track comparison matrices.</p>
      </div>

      {message.text && (
        <div className={`message-banner ${message.type} fade-in`}>
          {message.type === "success" ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="profile-layout">
        {/* Left Column: User Card */}
        <aside className="profile-card glass-panel fade-in">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-placeholder">
              <User size={48} color="var(--primary)" />
            </div>
            <h3>Learner Profile</h3>
            <span className="profile-badge">Verified Member</span>
          </div>

          <div className="profile-info-list">
            <div className="info-item">
              <label>Email Address</label>
              <span title={user.email}>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Account Status</label>
              <span>Active</span>
            </div>
          </div>

          <div className="tab-menu-list">
            <button 
              onClick={() => setActiveTab("profile")} 
              className={`tab-btn glass-panel ${activeTab === "profile" ? "active" : ""}`}
            >
              <Sliders size={16} />
              <span>Edit Profile</span>
            </button>
            <button 
              onClick={() => setActiveTab("settings")} 
              className={`tab-btn glass-panel ${activeTab === "settings" ? "active" : ""}`}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button 
              onClick={() => setActiveTab("history")} 
              className={`tab-btn glass-panel ${activeTab === "history" ? "active" : ""}`}
            >
              <History size={16} />
              <span>Comparison History</span>
            </button>
          </div>
        </aside>

        {/* Right Column: Dynamic Form Tabs */}
        <main className="profile-content-tab glass-panel fade-in">
          {activeTab === "profile" && (
            <div className="tab-content fade-in">
              <h2>Preferences & Domains</h2>
              <p className="tab-subtitle">Update your fields of study and budget limits to personalize your courses search.</p>

              <form onSubmit={handleSavePreferences} className="preferences-form">
                {/* Preferred Domains */}
                <div className="form-group-section">
                  <label className="section-label">Preferred Domains</label>
                  <div className="domains-checkbox-grid">
                    {domainsList.map(domain => {
                      const isSelected = preferredDomains.includes(domain.id);
                      return (
                        <button
                          type="button"
                          key={domain.id}
                          onClick={() => handleDomainToggle(domain.id)}
                          className={`domain-badge-checkbox glass-panel ${isSelected ? "selected" : ""}`}
                        >
                          <span className="indicator">
                            {isSelected && <Check size={12} color="#ffffff" />}
                          </span>
                          <span className="icon-span">{domain.icon}</span>
                          <span>{domain.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Skill Level & Budget */}
                <div className="form-row-two">
                  <div className="form-group-section">
                    <label htmlFor="skill-level" className="section-label">Skill Level</label>
                    <select
                      id="skill-level"
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      className="form-select glass-panel"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>

                  <div className="form-group-section">
                    <label className="section-label">
                      Budget Range Limit (INR): <span className="highlight-text">â‚¹{budgetLimit.toLocaleString("en-IN")}</span>
                    </label>
                    <div className="budget-slider-box">
                      <input
                        type="range"
                        min="0"
                        max="60000"
                        step="500"
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit(Number(e.target.value))}
                        className="budget-range-slider"
                      />
                      <div className="slider-limits">
                        <span>â‚¹0 (Free)</span>
                        <span>â‚¹60,000+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferred Platforms */}
                <div className="form-group-section">
                  <label className="section-label">Preferred Platforms</label>
                  <div className="platforms-checkbox-grid">
                    {platformsList.map(platform => {
                      const isSelected = preferredPlatforms.includes(platform);
                      return (
                        <label key={platform} className="platform-checkbox-label glass-panel">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handlePlatformToggle(platform)}
                            className="hidden-checkbox"
                          />
                          <span className="custom-checkbox-indicator">
                            {isSelected && <Check size={12} />}
                          </span>
                          <span>{platform}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary save-btn" disabled={loading}>
                    <Save size={16} />
                    <span>{loading ? "Saving..." : "Save Preferences"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="tab-content fade-in">
              <h2>Account Settings</h2>
              <p className="tab-subtitle">Manage security settings, notifications, and passwords.</p>

              {/* Password update form */}
              <form onSubmit={handlePasswordChange} className="settings-form">
                <div className="form-group-section">
                  <label className="section-label">Update Password</label>
                  
                  <div className="form-group">
                    <label htmlFor="current-pass">Current Password</label>
                    <div className="password-input-wrapper">
                      <input
                        id="current-pass"
                        type={showCurrentPass ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="form-input glass-panel"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="password-toggle-btn"
                      >
                        {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-row-two">
                    <div className="form-group">
                      <label htmlFor="new-pass">New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          id="new-pass"
                          type={showNewPass ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="form-input glass-panel"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="password-toggle-btn"
                        >
                          {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirm-pass">Confirm New Password</label>
                      <input
                        id="confirm-pass"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="form-input glass-panel"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Notifications Preferences */}
                <div className="form-group-section border-top-divider">
                  <label className="section-label">Preferences</label>
                  
                  <label className="settings-toggle-row glass-panel">
                    <div className="toggle-info">
                      <Bell size={18} color="var(--primary)" />
                      <div>
                        <h4>Email Course Alerts</h4>
                        <p>Receive notifications when new courses matching your profile are listed.</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="styled-toggle-checkbox"
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary save-btn" disabled={loading}>
                    <Lock size={16} />
                    <span>{loading ? "Updating..." : "Update Security Settings"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "history" && (
            <div className="tab-content fade-in">
              <div className="history-tab-header">
                <div>
                  <h2>Comparison History</h2>
                  <p className="tab-subtitle">Access your past course comparisons side-by-side matrices instantly.</p>
                </div>
                <button onClick={fetchHistory} className="refresh-history-btn" title="Refresh history">
                  <RefreshCw size={16} />
                </button>
              </div>

              {historyLoading ? (
                <div className="history-loader">
                  <div className="loading-spinner"></div>
                  <p>Fetching comparison logs...</p>
                </div>
              ) : historyList.length > 0 ? (
                <div className="history-list-wrapper">
                  {historyList.map(log => (
                    <div key={log._id} className="history-item-card glass-panel fade-in">
                      <div className="history-item-meta">
                        <span className="history-date">
                          {new Date(log.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        <div className="history-courses-badges">
                          {log.courses.map(course => (
                            <span key={course.id} className="history-course-badge">
                              {course.title}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleLoadHistoryComparison(log.courses)}
                        className="btn-secondary view-again-btn"
                      >
                        View Again
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-history-state glass-panel fade-in">
                  <History size={36} color="var(--text-muted)" />
                  <h3>No comparisons logged yet</h3>
                  <p>Add 2 or 3 courses to the comparison engine and view their comparison matrix to see them log here.</p>
                  <button onClick={() => navigate("/courses")} className="btn-primary explore-btn">
                    Explore Courses
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .profile-page-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
          position: relative;
        }

        .profile-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .profile-header p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .message-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .message-banner.success {
          background: rgba(16, 185, 129, 0.15);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .message-banner.error {
          background: rgba(239, 68, 68, 0.15);
          color: var(--error);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .profile-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
          align-items: start;
        }

        /* Avatar Card */
        .profile-card {
          padding: 24px;
          background: var(--bg-glass);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-avatar-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .profile-avatar-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(29, 92, 255, 0.08);
          border: 1px solid rgba(29, 92, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-avatar-wrapper h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .profile-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }

        .profile-info-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-item label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .info-item span {
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tab-menu-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          width: 100%;
          text-align: left;
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: rgba(29, 92, 255, 0.06);
        }

        .tab-btn.active {
          color: var(--primary);
          background: rgba(29, 92, 255, 0.08);
          border: 1px solid rgba(29, 92, 255, 0.25);
        }

        /* Right Panel tabs content */
        .profile-content-tab {
          padding: 32px;
          background: var(--bg-glass);
          min-height: 500px;
        }

        .tab-content h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .tab-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 28px;
        }

        .form-group-section {
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          border-left: 3px solid var(--primary);
          padding-left: 10px;
          margin-bottom: 4px;
        }

        /* Domains checkbox grid */
        .domains-checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 12px;
        }

        .domain-badge-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .domain-badge-checkbox:hover {
          background: rgba(29, 92, 255, 0.06);
          color: var(--text-primary);
        }

        .domain-badge-checkbox.selected {
          border-color: var(--primary);
          background: rgba(29, 92, 255, 0.08);
          color: var(--primary);
        }

        .domain-badge-checkbox .indicator {
          width: 16px;
          height: 16px;
          border: 1.5px solid var(--text-muted);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .domain-badge-checkbox.selected .indicator {
          background: var(--primary);
          border-color: var(--primary);
        }

        .icon-span {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
        }

        .domain-badge-checkbox.selected .icon-span {
          opacity: 1;
        }

        /* Platforms checkbox grid */
        .platforms-checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
          max-height: 180px;
          overflow-y: auto;
          padding-right: 6px;
        }

        /* Styled custom scrollbars for platform list in profile page */
        .platforms-checkbox-grid::-webkit-scrollbar {
          width: 4px;
        }
        .platforms-checkbox-grid::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.04);
        }
        .platforms-checkbox-grid::-webkit-scrollbar-thumb {
          background: rgba(29, 92, 255, 0.12);
          border-radius: 2px;
        }
        .platforms-checkbox-grid::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }

        .platform-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .platform-checkbox-label:hover {
          color: var(--text-primary);
          background: rgba(29, 92, 255, 0.06);
        }

        .hidden-checkbox {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .custom-checkbox-indicator {
          width: 14px;
          height: 14px;
          border: 1px solid var(--text-muted);
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .platform-checkbox-label input:checked + .custom-checkbox-indicator {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--text-primary);
        }

        /* Budget Slider styling */
        .budget-slider-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .budget-range-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: var(--radius-full);
          background: rgba(29, 92, 255, 0.12);
          outline: none;
        }

        .budget-range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(29, 92, 255, 0.5);
          transition: transform var(--transition-fast);
        }

        .budget-range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider-limits {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .highlight-text {
          color: var(--primary);
          font-weight: 700;
        }

        /* Form elements */
        .form-row-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-select, .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          font-size: 0.88rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .form-select:focus, .form-input:focus {
          border-color: var(--primary);
        }

        .form-select option {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .password-toggle-btn:hover {
          color: var(--text-primary);
        }

        .border-top-divider {
          border-top: 1px solid var(--border-color);
          padding-top: 24px;
          margin-top: 12px;
        }

        /* Settings Toggle */
        .settings-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .settings-toggle-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .toggle-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .toggle-info h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .toggle-info p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .styled-toggle-checkbox {
          width: 36px;
          height: 18px;
          -webkit-appearance: none;
          background: rgba(29, 92, 255, 0.18);
          border-radius: var(--radius-full);
          position: relative;
          outline: none;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .styled-toggle-checkbox:checked {
          background: var(--primary);
        }

        .styled-toggle-checkbox::before {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          top: 2px;
          left: 2px;
          transition: transform var(--transition-fast);
        }

        .styled-toggle-checkbox:checked::before {
          transform: translateX(18px);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          font-size: 0.9rem;
        }

        /* History items list */
        .history-tab-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .refresh-history-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .refresh-history-btn:hover {
          color: var(--primary);
          background: rgba(29, 92, 255, 0.06);
        }

        .history-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 48px;
          color: var(--text-secondary);
        }

        .history-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .history-item-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.02);
          transition: all var(--transition-fast);
          gap: 20px;
        }

        .history-item-card:hover {
          background: rgba(148, 163, 184, 0.16);
        }

        .history-item-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .history-date {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .history-courses-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .history-course-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          background: rgba(29, 92, 255, 0.06);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
        }

        .view-again-btn {
          font-size: 0.8rem;
          padding: 8px 16px;
        }

        .no-history-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          padding: 60px;
        }

        .no-history-state h3 {
          font-size: 1.15rem;
          color: var(--text-primary);
          margin-top: 4px;
        }

        .no-history-state p {
          color: var(--text-secondary);
          font-size: 0.85rem;
          max-width: 320px;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .no-history-state .explore-btn {
          font-size: 0.85rem;
          padding: 8px 20px;
        }

        /* Glowing Orbs */
        .glowing-orb {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          z-index: -1;
          pointer-events: none;
          opacity: 0.15;
          filter: blur(120px);
        }

        .orb-1 {
          background: radial-gradient(circle, var(--primary) 0%, rgba(29, 92, 255, 0) 70%);
          top: -10%;
          left: -10%;
        }

        .orb-2 {
          background: radial-gradient(circle, #8f00ff 0%, rgba(143, 0, 255, 0) 70%);
          bottom: -10%;
          right: -10%;
        }

        /* Responsive styling */
        @media (max-width: 900px) {
          .profile-layout {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
}
