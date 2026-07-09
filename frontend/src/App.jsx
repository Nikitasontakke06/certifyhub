import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import CompareQueue from "./components/CompareQueue";
import ChatbotWidget from "./components/ChatbotWidget";

// Pages
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import ComparePage from "./pages/ComparePage";
import JobsPage from "./pages/JobsPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import OfflineClassesPage from "./pages/OfflineClassesPage";
import InstituteDetailPage from "./pages/InstituteDetailPage";
import OfflineComparePage from "./pages/OfflineComparePage";
import OfflineAdminPage from "./pages/OfflineAdminPage";

// ProtectedRoute component helper
function ProtectedRoute({ user, openAuth, children }) {
  useEffect(() => {
    if (!user) {
      openAuth();
    }
  }, [user, openAuth]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [offlineCompareList, setOfflineCompareList] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleToggleOfflineCompare = (institute) => {
    setOfflineCompareList(prev => {
      const exists = prev.some(item => item.id === institute.id);
      if (exists) {
        return prev.filter(item => item.id !== institute.id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 coaching institutes at a time.");
          return prev;
        }
        return [...prev, institute];
      }
    });
  };

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("current_user");
        setIsAuthOpen(true);
      }
    } else {
      setIsAuthOpen(true);
    }
  }, []);

  // Fetch Courses and Jobs from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesRes, jobsRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/jobs")
        ]);
        
        if (coursesRes.ok && jobsRes.ok) {
          const coursesData = await coursesRes.json();
          const jobsData = await jobsRes.json();
          setCourses(coursesData);
          setJobs(jobsData);
        } else {
          console.error("API responses were not successful");
        }
      } catch (err) {
        console.error("Failed to fetch data from API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleLoadComparison = (courses) => {
    setCompareList(courses);
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
                user ? (
                  <HomePage 
                    user={user}
                    openAuth={() => setIsAuthOpen(true)}
                    courses={courses}
                    jobs={jobs}
                    loading={loading}
                    compareList={compareList}
                    onToggleCompare={handleToggleCompare}
                  />
                ) : (
                  <LandingPage 
                    user={user}
                    openAuth={() => setIsAuthOpen(true)}
                    courses={courses}
                    loading={loading}
                    onToggleCompare={handleToggleCompare} 
                    compareList={compareList} 
                  />
                )
              } 
            />
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute user={user} openAuth={() => setIsAuthOpen(true)}>
                  <CoursesPage 
                    courses={courses}
                    loading={loading}
                    onToggleCompare={handleToggleCompare} 
                    compareList={compareList} 
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/compare" 
              element={
                <ProtectedRoute user={user} openAuth={() => setIsAuthOpen(true)}>
                  <ComparePage 
                    compareList={compareList} 
                    onRemove={handleRemoveCompare} 
                    onClear={handleClearCompare} 
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs" 
              element={
                <ProtectedRoute user={user} openAuth={() => setIsAuthOpen(true)}>
                  <JobsPage 
                    jobs={jobs} 
                    loading={loading} 
                  />
                </ProtectedRoute>
              } 
            />
            <Route path="/about" element={<AboutPage />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute user={user} openAuth={() => setIsAuthOpen(true)}>
                  <ProfilePage 
                    user={user}
                    onLoadComparison={handleLoadComparison}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/offline-classes" 
              element={
                <ProtectedRoute user={user} openAuth={() => setIsAuthOpen(true)}>
                  <OfflineClassesPage 
                    user={user}
                    openAuth={() => setIsAuthOpen(true)}
                    compareList={offlineCompareList}
                    onToggleCompare={handleToggleOfflineCompare}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/institute/:id" 
              element={
                <ProtectedRoute user={user} openAuth={() => setIsAuthOpen(true)}>
                  <InstituteDetailPage 
                    user={user}
                    openAuth={() => setIsAuthOpen(true)}
                    compareList={offlineCompareList}
                    onToggleCompare={handleToggleOfflineCompare}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/offline-compare" 
              element={
                <ProtectedRoute user={user} openAuth={() => setIsAuthOpen(true)}>
                  <OfflineComparePage 
                    compareList={offlineCompareList}
                    onToggleCompare={handleToggleOfflineCompare}
                    openAuth={() => setIsAuthOpen(true)}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/offline-admin" 
              element={
                <ProtectedRoute user={user} openAuth={() => setIsAuthOpen(true)}>
                  <OfflineAdminPage 
                    user={user}
                    openAuth={() => setIsAuthOpen(true)}
                  />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        <Footer />
        
        {/* Persistent overlays */}
        <CompareQueue 
          compareList={compareList} 
          onRemove={handleRemoveCompare} 
          onClear={handleClearCompare} 
        />
        
        <ChatbotWidget />
        
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
