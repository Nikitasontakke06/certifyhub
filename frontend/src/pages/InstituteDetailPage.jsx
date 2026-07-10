import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAuthHeaders } from "../utils/auth";
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Calendar,
  Clock,
  BookOpen,
  Award,
  ShieldCheck,
  Heart,
  ChevronLeft,
  Info,
  Check,
  User,
  Plus,
  ThumbsUp,
  X,
  Compass
} from "lucide-react";

export default function InstituteDetailPage({ user, openAuth, onToggleCompare, compareList = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [institute, setInstitute] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedInsts, setSavedInsts] = useState({ savedInstitutes: [], savedInstituteCourses: [] });

  // Review Form state
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewTextInput, setReviewTextInput] = useState("");
  const [proInput, setProInput] = useState("");
  const [conInput, setConInput] = useState("");
  const [prosList, setProsList] = useState([]);
  const [consList, setConsList] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Inquiry Form state
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [inquiryType, setInquiryType] = useState("callback"); // callback, demo, visit, inquiry
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Notification message toast
  const [toastMsg, setToastMsg] = useState(null);

  const triggerToast = (type, text) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchInstituteDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/institutes/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInstitute(data);
        if (data.courses && data.courses.length > 0) {
          setSelectedCourse(data.courses[0]);
        }
      } else {
        triggerToast("error", "Institute not found.");
      }
    } catch (err) {
      console.error("Error loading details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/institutes/${id}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  const fetchBookmarks = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/saved-institutes", {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setSavedInsts(data);
      }
    } catch (err) {
      console.error("Error loading bookmarks:", err);
    }
  };

  useEffect(() => {
    fetchInstituteDetails();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const handleToggleSave = async (instId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user) {
      openAuth();
      return;
    }
    try {
      const res = await fetch("/api/saved-institutes/toggle", {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ instituteId: instId })
      });
      if (res.ok) {
        const updated = await res.json();
        setSavedInsts(updated);
        triggerToast("success", isSaved(instId) ? "Removed from bookmarks." : "Bookmarked successfully!");
      }
    } catch (err) {
      console.error("Error saving bookmark:", err);
    }
  };

  const handleToggleCourseSave = async (courseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuth();
      return;
    }
    try {
      const res = await fetch("/api/saved-institutes/toggle", {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ courseId })
      });
      if (res.ok) {
        const updated = await res.json();
        setSavedInsts(updated);
        triggerToast("success", isCourseSaved(courseId) ? "Course removed from bookmarks." : "Course bookmarked successfully!");
      }
    } catch (err) {
      console.error("Error saving course bookmark:", err);
    }
  };

  const handleAddPro = () => {
    if (proInput.trim() && !prosList.includes(proInput.trim())) {
      setProsList([...prosList, proInput.trim()]);
      setProInput("");
    }
  };

  const handleAddCon = () => {
    if (conInput.trim() && !consList.includes(conInput.trim())) {
      setConsList([...consList, conInput.trim()]);
      setConInput("");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuth();
      return;
    }
    if (!reviewTextInput.trim()) {
      triggerToast("error", "Please write a review comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/institutes/${id}/reviews`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          userName: user.name || user.email.split("@")[0],
          rating: ratingInput,
          text: reviewTextInput,
          pros: prosList,
          cons: consList
        })
      });

      if (res.ok) {
        triggerToast("success", "Thank you! Your review has been posted.");
        setReviewTextInput("");
        setProsList([]);
        setConsList([]);
        fetchReviews();
        fetchInstituteDetails(); // reload score average
      } else {
        triggerToast("error", "Failed to submit review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    if (!user) {
      openAuth();
      return;
    }
    try {
      const res = await fetch(`/api/institutes/${id}/reviews/${reviewId}/like`, {
        method: "POST",
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error("Error liking review:", err);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuth();
      return;
    }
    setSubmittingInquiry(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          instituteId: id,
          instituteName: institute.name,
          courseId: selectedCourse ? selectedCourse.id : "",
          courseName: selectedCourse ? selectedCourse.title : "",
          type: inquiryType,
          message: inquiryMessage
        })
      });

      if (res.ok) {
        triggerToast("success", `Booking inquiry submitted! They will contact you shortly.`);
        setShowInquiryModal(false);
        setInquiryMessage("");
      } else {
        triggerToast("error", "Failed to submit inquiry booking.");
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const isSaved = (instId) => savedInsts.savedInstitutes.includes(instId);
  const isCourseSaved = (courseId) => savedInsts.savedInstituteCourses.includes(courseId);
  const isCompared = (instId) => compareList.some(item => item.id === instId);

  // Reviews stars statistics helper
  const getRatingDistribution = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rounded = Math.round(r.rating);
      if (counts[rounded] !== undefined) counts[rounded]++;
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="detail-loading-state page-container">
        <Compass className="animate-spin" size={48} color="var(--primary)" />
        <p>Loading institute profile details...</p>
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="detail-empty-state page-container text-center">
        <Info size={48} color="var(--text-muted)" />
        <h2>Coaching Profile Not Found</h2>
        <p>This profile might have been deleted or the link is invalid.</p>
        <button onClick={() => navigate("/offline-classes")} className="btn-primary">Back to Discovery</button>
      </div>
    );
  }

  const dist = getRatingDistribution();
  const maxReviewsCount = Math.max(...Object.values(dist)) || 1;

  return (
    <div className="institute-detail-page page-container">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className={`toast-alert glass-panel fade-in ${toastMsg.type}`}>
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Navigation header back */}
      <div className="detail-navigation-bar">
        <Link to="/offline-classes" className="back-link">
          <ChevronLeft size={16} />
          <span>Back to discoveries</span>
        </Link>
      </div>

      {/* Cover Image Banner */}
      <div className="detail-hero-banner fade-in">
        <img src={institute.coverImage} alt={institute.name} className="hero-cover-img" />
        <div className="hero-gradient-overlay"></div>
        <div className="hero-content">
          <img src={institute.logo} alt={institute.name} className="hero-logo-img" />
          <div className="hero-text-section">
            <div className="hero-top-row">
              <h1>{institute.name}</h1>
              <div className="action-buttons-wrap">
                <button 
                  onClick={() => onToggleCompare(institute)}
                  className={`btn-action-outline compare-btn ${isCompared(institute.id) ? "compared" : ""}`}
                >
                  {isCompared(institute.id) ? "In Compare Center" : "Compare"}
                </button>
                <button 
                  onClick={() => handleToggleSave(institute.id)}
                  className={`btn-action-outline bookmark-btn ${isSaved(institute.id) ? "saved" : ""}`}
                >
                  <Heart size={16} fill={isSaved(institute.id) ? "var(--error)" : "none"} />
                  <span>{isSaved(institute.id) ? "Bookmarked" : "Bookmark"}</span>
                </button>
              </div>
            </div>

            <div className="hero-meta-row">
              <div className="meta-item">
                <MapPin size={16} color="var(--primary)" />
                <span>{institute.address}</span>
              </div>
              <div className="meta-item">
                <Star size={16} fill="var(--primary)" color="var(--primary)" />
                <strong>{institute.rating}</strong>
                <span>({institute.reviewsCount} verified reviews)</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>Established {institute.establishedYear}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content Layout */}
      <div className="detail-grid-container fade-in">
        
        {/* Left main pane */}
        <main className="detail-main-pane">
          
          {/* About section */}
          <section className="detail-section glass-panel">
            <h2>About the Institute</h2>
            <p className="about-text">{institute.description}</p>

            <div className="infrastructure-box">
              <h3>Campus Facilities & Infrastructure</h3>
              <div className="facility-grid">
                {institute.infrastructure.map((fac, idx) => (
                  <div key={idx} className="facility-item">
                    <Check size={16} color="var(--primary)" />
                    <span>{fac}</span>
                  </div>
                ))}
                {institute.practicalLabs && (
                  <div className="facility-item">
                    <Check size={16} color="var(--primary)" />
                    <span>Structured Practical Labs</span>
                  </div>
                )}
                {institute.placementRecord && (
                  <div className="facility-item">
                    <Award size={16} color="var(--primary)" />
                    <span>{institute.placementRecord}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Courses Offered */}
          <section className="detail-section glass-panel">
            <h2>Offered Courses & Batches</h2>
            <div className="courses-listing-container">
              {institute.courses.map(course => (
                <div key={course.id} className="course-row-card">
                  <div className="course-header-row">
                    <div className="course-title-section">
                      <h3>{course.title}</h3>
                      <div className="course-badges">
                        <span className="badge-mode">{course.mode}</span>
                        <span className="badge-duration">{course.duration}</span>
                        {course.placementAssistance && (
                          <span className="badge-placement">Placement Assistance</span>
                        )}
                      </div>
                    </div>
                    <div className="course-fee-section">
                      <span>Course Fee</span>
                      <strong>₹{course.fees.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>

                  <div className="course-details-grid">
                    <div className="detail-block">
                      <Clock size={14} />
                      <div>
                        <strong>Batch Timings</strong>
                        <span>{course.batchTimings}</span>
                      </div>
                    </div>
                    <div className="detail-block">
                      <Calendar size={14} />
                      <div>
                        <strong>Next Batch Starts</strong>
                        <span>{new Date(course.startDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="detail-block">
                      <User size={14} />
                      <div>
                        <strong>Lead Instructor</strong>
                        <span>{course.trainerName}</span>
                      </div>
                    </div>
                    <div className="detail-block">
                      <ShieldCheck size={14} />
                      <div>
                        <strong>Certification</strong>
                        <span>{course.certification}</span>
                      </div>
                    </div>
                  </div>

                  {course.syllabus && course.syllabus.length > 0 && (
                    <div className="syllabus-expansion">
                      <strong>Course Syllabus Modules</strong>
                      <div className="syllabus-pill-grid">
                        {course.syllabus.map((syl, i) => (
                          <span key={i} className="syllabus-pill">{syl}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="course-actions">
                    <button 
                      onClick={() => handleToggleCourseSave(course.id)} 
                      className={`btn-outline ${isCourseSaved(course.id) ? "saved" : ""}`}
                    >
                      <Heart size={14} fill={isCourseSaved(course.id) ? "var(--error)" : "none"} />
                      <span>{isCourseSaved(course.id) ? "Saved Course" : "Save Course"}</span>
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowInquiryModal(true);
                      }} 
                      className="btn-primary"
                    >
                      Book Demo / Inquiry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Student Reviews & Ratings */}
          <section className="detail-section glass-panel">
            <h2>Student Reviews ({reviews.length})</h2>
            
            <div className="reviews-dashboard">
              {/* Overall Ratings Card */}
              <div className="overall-score-card">
                <h1>{institute.rating}</h1>
                <div className="stars-row">
                  {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star} 
                      size={18} 
                      fill={star <= Math.round(institute.rating) ? "var(--primary)" : "none"} 
                      color="var(--primary)" 
                    />
                  ))}
                </div>
                <span>Average Student Rating</span>
              </div>

              {/* Progress Distributions */}
              <div className="rating-dist-bars">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = dist[stars] || 0;
                  const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={stars} className="dist-row">
                      <span>{stars} ⭐</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                      <span>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Write a review Form */}
            <div className="write-review-form-section">
              <h3>Submit Your Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-stars-select-row">
                  <span>Your Rating: </span>
                  <div className="stars-inputs">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button 
                        type="button" 
                        key={val}
                        onClick={() => setRatingInput(val)}
                        className={`star-select-btn ${ratingInput >= val ? "active" : ""}`}
                      >
                        <Star size={20} fill={ratingInput >= val ? "var(--primary)" : "none"} color="var(--primary)" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="review-textarea-group">
                  <textarea 
                    placeholder="Describe your learning experience, labs infrastructure, trainers, and placement support..."
                    value={reviewTextInput}
                    onChange={(e) => setReviewTextInput(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="pros-cons-inputs-row">
                  <div className="input-with-add">
                    <label>Add Pro Tag</label>
                    <div className="input-wrap">
                      <input 
                        type="text" 
                        placeholder="e.g. Friendly staff"
                        value={proInput}
                        onChange={(e) => setProInput(e.target.value)}
                      />
                      <button type="button" onClick={handleAddPro} className="btn-add"><Plus size={16} /></button>
                    </div>
                    <div className="tags-preview">
                      {prosList.map((tag, idx) => (
                        <span key={idx} className="pro-tag-item">
                          {tag} <X size={12} onClick={() => setProsList(prosList.filter(t => t !== tag))} />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="input-with-add">
                    <label>Add Con Tag</label>
                    <div className="input-wrap">
                      <input 
                        type="text" 
                        placeholder="e.g. Small classrooms"
                        value={conInput}
                        onChange={(e) => setConInput(e.target.value)}
                      />
                      <button type="button" onClick={handleAddCon} className="btn-add"><Plus size={16} /></button>
                    </div>
                    <div className="tags-preview">
                      {consList.map((tag, idx) => (
                        <span key={idx} className="con-tag-item">
                          {tag} <X size={12} onClick={() => setConsList(consList.filter(t => t !== tag))} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submittingReview} 
                  className="btn-primary form-submit-btn"
                >
                  {submittingReview ? "Submitting..." : "Post Review"}
                </button>
              </form>
            </div>

            {/* Reviews Feed */}
            <div className="reviews-feed-container">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review._id} className="review-comment-card">
                    <div className="review-header">
                      <div className="user-avatar-row">
                        <div className="avatar-fallback">{review.userName.slice(0,2).toUpperCase()}</div>
                        <div>
                          <h4>{review.userName}</h4>
                          <span>Reviewed on {new Date(review.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="comment-rating-pill">
                        <Star size={12} fill="var(--primary)" color="var(--primary)" />
                        <span>{review.rating}.0</span>
                      </div>
                    </div>

                    <p className="comment-text">{review.text}</p>

                    {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
                      <div className="comment-pros-cons">
                        {review.pros && review.pros.length > 0 && (
                          <div className="pros-column">
                            <strong>Pros:</strong>
                            <div className="mini-tags-wrap">
                              {review.pros.map((p, idx) => (
                                <span key={idx} className="pro-mini-tag">{p}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {review.cons && review.cons.length > 0 && (
                          <div className="cons-column">
                            <strong>Cons:</strong>
                            <div className="mini-tags-wrap">
                              {review.cons.map((c, idx) => (
                                <span key={idx} className="con-mini-tag">{c}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="comment-actions">
                      <button 
                        type="button" 
                        onClick={() => handleLikeReview(review._id)} 
                        className={`btn-like ${review.likedBy.includes(user?.email?.toLowerCase()) ? "liked" : ""}`}
                      >
                        <ThumbsUp size={14} />
                        <span>Helpful ({review.likes})</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-reviews-state text-center">
                  <p>No student reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>

          </section>

        </main>

        {/* Right Sidebar panels */}
        <aside className="detail-sidebar">
          
          {/* Quick Contacts panel */}
          <div className="sidebar-card glass-panel">
            <h3>Get in Touch</h3>
            <div className="contacts-list">
              <div className="contact-item">
                <Phone size={16} />
                <div>
                  <span>Contact Phone</span>
                  <strong>{institute.phone}</strong>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <div>
                  <span>Email Address</span>
                  <strong>{institute.email}</strong>
                </div>
              </div>
              <div className="contact-item">
                <Globe size={16} />
                <div>
                  <span>Official Website</span>
                  <a href={institute.website} target="_blank" rel="noreferrer">{institute.website.replace("https://", "")}</a>
                </div>
              </div>
            </div>

            <div className="chat-action-divider"></div>

            {/* Direct WhatsApp Callout */}
            <a 
              href={`https://wa.me/${institute.whatsapp.replace(/[^0-9]/g, "")}?text=Hi,%20I'm%20interested%20in%20classes%20at%20${encodeURIComponent(institute.name)}`}
              target="_blank" 
              rel="noreferrer"
              className="whatsapp-direct-btn"
            >
              <MessageCircle size={18} />
              <span>Direct Chat on WhatsApp</span>
            </a>
          </div>

          {/* Location details card */}
          <div className="sidebar-card glass-panel">
            <h3>Campus Location</h3>
            <div className="location-box">
              <p className="address-para">{institute.address}</p>
              
              {institute.landmarks && institute.landmarks.length > 0 && (
                <div className="landmarks-box">
                  <strong>Landmarks & Directions:</strong>
                  <ul>
                    {institute.landmarks.map((l, idx) => (
                      <li key={idx}>{l}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Map Placeholder representation */}
            <div className="sidebar-map-wrapper">
              <div className="mock-directions-map">
                <MapPin size={32} color="var(--primary)" className="bounce-animation" />
                <span className="city-tag">{institute.city} Hub</span>
              </div>
            </div>
            
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(institute.name + " " + institute.address)}`} 
              target="_blank" 
              rel="noreferrer" 
              className="google-directions-btn btn-secondary"
            >
              Get Directions on Google Maps
            </a>
          </div>

        </aside>

      </div>

      {/* Demo Inquiry Booking Modal */}
      {showInquiryModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-content glass-panel scale-up">
            <div className="modal-header">
              <h3>Demo Booking & callback Request</h3>
              <button onClick={() => setShowInquiryModal(false)} className="modal-close-btn"><X size={20} /></button>
            </div>

            <form onSubmit={handleInquirySubmit} className="inquiry-modal-form">
              <div className="form-group">
                <label>Target Institute</label>
                <input type="text" value={institute.name} disabled className="disabled-input" />
              </div>

              <div className="form-group">
                <label>Select Course Class</label>
                <select 
                  value={selectedCourse ? selectedCourse.id : ""}
                  onChange={(e) => setSelectedCourse(institute.courses.find(c => c.id === e.target.value))}
                  className="filter-select"
                >
                  {institute.courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Inquiry Type</label>
                <div className="inquiry-type-radios">
                  {[
                    { val: "callback", label: "Request Callback" },
                    { val: "demo", label: "Book Demo Class" },
                    { val: "visit", label: "Schedule Campus Visit" },
                    { val: "inquiry", label: "General Inquiry" }
                  ].map(type => (
                    <label key={type.val} className="radio-container">
                      <input 
                        type="radio" 
                        name="inquiryType"
                        value={type.val}
                        checked={inquiryType === type.val}
                        onChange={() => setInquiryType(type.val)}
                      />
                      <span className="radio-checkmark"></span>
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes / Details</label>
                <textarea 
                  placeholder="e.g. I want to inquire about installment payment models or customized weekend timings..."
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <button 
                type="submit" 
                disabled={submittingInquiry} 
                className="btn-primary modal-submit-btn"
              >
                {submittingInquiry ? "Submitting Request..." : "Confirm Schedule Request"}
              </button>

            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .institute-detail-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-navigation-bar {
          margin-bottom: 8px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          transition: color var(--transition-fast);
        }

        .back-link:hover {
          color: var(--primary);
        }

        /* Hero Banner */
        .detail-hero-banner {
          height: 380px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 40px;
        }

        .hero-cover-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }

        .hero-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(0deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.5) 60%, rgba(15, 23, 42, 0) 100%);
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          display: flex;
          gap: 28px;
          align-items: center;
          width: 100%;
        }

        .hero-logo-img {
          width: 120px;
          height: 120px;
          border-radius: var(--radius-lg);
          border: 3px solid #FFFFFF;
          object-fit: cover;
          background: #FFFFFF;
          box-shadow: var(--shadow-lg);
        }

        .hero-text-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .hero-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .hero-top-row h1 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .action-buttons-wrap {
          display: flex;
          gap: 10px;
        }

        .btn-action-outline {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #FFFFFF;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-action-outline:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: #FFFFFF;
        }

        .btn-action-outline.saved {
          color: var(--error);
          border-color: var(--error);
          background: rgba(239, 68, 68, 0.1);
        }

        .btn-action-outline.compared {
          color: var(--primary);
          border-color: var(--primary);
          background: rgba(29, 92, 255, 0.1);
        }

        .hero-meta-row {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .meta-item strong {
          color: #FFFFFF;
        }

        @media (max-width: 768px) {
          .detail-hero-banner {
            height: auto;
            padding: 24px;
          }
          .hero-content {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }
          .hero-top-row {
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
          .hero-top-row h1 {
            font-size: 1.5rem;
          }
          .hero-meta-row {
            justify-content: center;
            gap: 12px;
          }
        }

        /* Detail Grid Layout */
        .detail-grid-container {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 36px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .detail-grid-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .detail-main-pane {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .detail-section {
          padding: 28px;
        }

        .detail-section h2 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
          margin-bottom: 20px;
        }

        .about-text {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .infrastructure-box {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px;
        }

        .infrastructure-box h3 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .facility-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (max-width: 600px) {
          .facility-grid {
            grid-template-columns: 1fr;
          }
        }

        .facility-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        /* Courses Offered Listing */
        .courses-listing-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .course-row-card {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .course-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 14px;
        }

        .course-title-section h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .course-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .course-badges span {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }

        .badge-mode {
          background: rgba(29, 92, 255, 0.1);
          color: var(--primary);
        }

        .badge-duration {
          background: rgba(15, 23, 42, 0.08);
          color: var(--text-secondary);
        }

        .badge-placement {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .course-fee-section {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .course-fee-section span {
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .course-fee-section strong {
          font-size: 1.15rem;
          color: var(--primary);
          font-weight: 800;
        }

        .course-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 600px) {
          .course-details-grid {
            grid-template-columns: 1fr;
          }
        }

        .detail-block {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          color: var(--text-secondary);
        }

        .detail-block strong {
          display: block;
          font-size: 0.78rem;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin-bottom: 2px;
        }

        .detail-block span {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .syllabus-expansion {
          background: rgba(255, 255, 255, 0.5);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-sm);
          padding: 14px;
        }

        .syllabus-expansion strong {
          font-size: 0.78rem;
          color: var(--text-primary);
          display: block;
          margin-bottom: 8px;
        }

        .syllabus-pill-grid {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .syllabus-pill {
          font-size: 0.72rem;
          font-weight: 600;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
        }

        .course-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }

        /* Ratings Dashboard */
        .reviews-dashboard {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 32px;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 24px;
          border-radius: var(--radius-md);
          margin-bottom: 32px;
        }

        @media (max-width: 600px) {
          .reviews-dashboard {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        .overall-score-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .overall-score-card h1 {
          font-size: 3rem;
          font-weight: 900;
          color: var(--text-primary);
          margin: 0;
        }

        .stars-row {
          display: flex;
          gap: 2px;
        }

        .overall-score-card span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .rating-dist-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dist-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .dist-row span:first-child {
          width: 40px;
          text-align: right;
        }

        .dist-row span:last-child {
          width: 20px;
        }

        .bar-track {
          flex: 1;
          height: 6px;
          background: var(--border-color);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: var(--primary);
          border-radius: var(--radius-full);
        }

        /* Write a Review Section */
        .write-review-form-section {
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 24px;
          margin-bottom: 32px;
        }

        .write-review-form-section h3 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .form-stars-select-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .stars-inputs {
          display: flex;
          gap: 4px;
        }

        .star-select-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 2px;
          color: var(--border-color);
          transition: all var(--transition-fast);
        }

        .star-select-btn.active, .star-select-btn:hover {
          color: var(--primary);
        }

        .review-textarea-group textarea {
          width: 100%;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 12px;
          background: #FFFFFF;
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
          resize: vertical;
        }

        .review-textarea-group textarea:focus {
          border-color: var(--primary);
        }

        .pros-cons-inputs-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 16px;
        }

        @media (max-width: 600px) {
          .pros-cons-inputs-row {
            grid-template-columns: 1fr;
          }
        }

        .input-with-add {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-with-add label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .input-with-add .input-wrap {
          display: flex;
          gap: 8px;
        }

        .input-with-add input {
          flex: 1;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          font-size: 0.85rem;
          outline: none;
        }

        .btn-add {
          padding: 8px;
          border: none;
          background: var(--primary);
          color: #FFFFFF;
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tags-preview {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 6px;
        }

        .pro-tag-item, .con-tag-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }

        .pro-tag-item {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .con-tag-item {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .pro-tag-item svg, .con-tag-item svg {
          cursor: pointer;
        }

        .form-submit-btn {
          margin-top: 20px;
          padding: 10px 24px;
        }

        /* Reviews Feed */
        .reviews-feed-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .review-comment-card {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
        }

        .review-comment-card:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .user-avatar-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-fallback {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .user-avatar-row h4 {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .user-avatar-row span {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .comment-rating-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .comment-text {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .comment-pros-cons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          background: var(--bg-secondary);
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 12px;
        }

        .pros-column strong, .cons-column strong {
          font-size: 0.72rem;
          font-weight: 800;
          display: block;
          margin-bottom: 6px;
        }

        .mini-tags-wrap {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .pro-mini-tag, .con-mini-tag {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }

        .pro-mini-tag {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .con-mini-tag {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .comment-actions {
          display: flex;
        }

        .btn-like {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .btn-like:hover, .btn-like.liked {
          color: var(--primary);
        }

        /* Sidebar contacts / locations */
        .detail-sidebar {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .sidebar-card {
          padding: 24px;
        }

        .sidebar-card h3 {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
          margin-bottom: 16px;
        }

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          color: var(--text-secondary);
        }

        .contact-item span {
          display: block;
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .contact-item strong {
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .contact-item a {
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .chat-action-divider {
          height: 1px;
          background: var(--border-color);
          margin: 20px 0;
        }

        .whatsapp-direct-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #25d366;
          color: #FFFFFF;
          border-radius: var(--radius-md);
          padding: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          text-align: center;
          transition: opacity var(--transition-fast);
        }

        .whatsapp-direct-btn:hover {
          opacity: 0.9;
        }

        .address-para {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .landmarks-box {
          margin-top: 14px;
          font-size: 0.8rem;
        }

        .landmarks-box strong {
          color: var(--text-primary);
          display: block;
          margin-bottom: 6px;
        }

        .landmarks-box ul {
          padding-left: 16px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: var(--text-secondary);
        }

        .sidebar-map-wrapper {
          height: 140px;
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-top: 16px;
          border: 1px solid var(--border-color);
        }

        .mock-directions-map {
          height: 100%;
          background: #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
        }

        .bounce-animation {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .city-tag {
          font-size: 0.72rem;
          font-weight: 800;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .google-directions-btn {
          margin-top: 16px;
          display: flex;
          justify-content: center;
          font-size: 0.8rem;
          width: 100%;
        }

        /* Inquiry Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 520px;
          background: #ffffff;
          padding: 28px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 14px;
          margin-bottom: 20px;
        }

        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .inquiry-modal-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .disabled-input {
          padding: 8px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .inquiry-type-radios {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 4px;
        }

        .radio-container {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          position: relative;
        }

        .radio-container input {
          display: none;
        }

        .radio-checkmark {
          width: 16px;
          height: 16px;
          border: 1px solid var(--border-color);
          border-radius: 50%;
          background: var(--bg-secondary);
          display: inline-block;
          position: relative;
        }

        .radio-container input:checked ~ .radio-checkmark {
          border-color: var(--primary);
        }

        .radio-container input:checked ~ .radio-checkmark::after {
          content: "";
          position: absolute;
          left: 4px;
          top: 4px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary);
        }

        .inquiry-modal-form textarea {
          width: 100%;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 10px;
          font-size: 0.85rem;
          outline: none;
          resize: vertical;
        }

        .modal-submit-btn {
          margin-top: 8px;
          padding: 12px;
        }

        /* Toast Alert styling */
        .toast-alert {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 2500;
          padding: 16px 24px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          font-weight: 700;
          font-size: 0.88rem;
          color: #FFFFFF;
        }

        .toast-alert.success {
          background: rgba(16, 185, 129, 0.95);
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .toast-alert.error {
          background: rgba(239, 68, 68, 0.95);
          border: 1px solid rgba(239, 68, 68, 0.4);
        }
      `}} />
    </div>
  );
}
