import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import CompareQueue from "./components/CompareQueue";

// Pages
import LandingPage from "./pages/LandingPage";
import CoursesPage from "./pages/CoursesPage";
import ComparePage from "./pages/ComparePage";
import JobsPage from "./pages/JobsPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("current_user");
      }
    }
  }, []);

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("current_user");
    setUser(null);
  };

  const handleToggleCompare = (course) => {
    setCompareList(prev => {
      const exists = prev.some(item => item.id === course.id);
      if (exists) {
        return prev.filter(item => item.id !== course.id);
      } else {
        // limit comparison to 3 courses
        if (prev.length >= 3) {
          alert("You can compare up to 3 courses at a time.");
          return prev;
        }
        return [...prev, course];
      }
    });
  };

  const handleRemoveCompare = (course) => {
    setCompareList(prev => prev.filter(item => item.id !== course.id));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  return (
    <Router>
      <div className="app-layout">
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          openAuth={() => setIsAuthOpen(true)} 
        />
        
        <main className="app-main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <LandingPage 
                  onToggleCompare={handleToggleCompare} 
                  compareList={compareList} 
                />
              } 
            />
            <Route 
              path="/courses" 
              element={
                <CoursesPage 
                  onToggleCompare={handleToggleCompare} 
                  compareList={compareList} 
                />
              } 
            />
            <Route 
              path="/compare" 
              element={
                <ComparePage 
                  compareList={compareList} 
                  onRemove={handleRemoveCompare} 
                  onClear={handleClearCompare} 
                />
              } 
            />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <Footer />
        
        {/* Persistent overlays */}
        <CompareQueue 
          compareList={compareList} 
          onRemove={handleRemoveCompare} 
          onClear={handleClearCompare} 
        />
        
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onLoginSuccess={handleLoginSuccess} 
        />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .app-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          position: relative;
        }

        .app-main-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
      `}} />
    </Router>
  );
}
