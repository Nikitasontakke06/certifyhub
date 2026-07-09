import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Plus,
  Trash2,
  Edit,
  Mail,
  User,
  CheckCircle,
  Clock,
  Briefcase,
  Layers,
  MapPin,
  X,
  BookOpen
} from "lucide-react";

export default function OfflineAdminPage({ user, openAuth }) {
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      openAuth();
      navigate("/");
    }
  }, [user]);

  // Tabs: "institutes" | "inquiries"
  const [activeTab, setActiveTab] = useState("institutes");

  // State
  const [institutes, setInstitutes] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formId, setFormId] = useState("");
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [establishedYear, setEstablishedYear] = useState(2020);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Pune");
  const [state, setState] = useState("Maharashtra");
  const [placementRecord, setPlacementRecord] = useState("");
  const [practicalLabs, setPracticalLabs] = useState(true);
  const [categories, setCategories] = useState(["programming"]);
  
  // Infrastructure facilities inputs
  const [infraInput, setInfraInput] = useState("");
  const [infraList, setInfraList] = useState([]);

  // Courses offered inside form
  const [coursesList, setCoursesList] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCategory, setCourseCategory] = useState("programming");
  const [courseDuration, setCourseDuration] = useState("6 months");
  const [courseMode, setCourseMode] = useState("Offline");
  const [courseFees, setCourseFees] = useState(30000);
  const [courseTimings, setCourseTimings] = useState("Morning (9 AM - 12 PM)");
  const [courseTrainer, setCourseTrainer] = useState("");
  const [courseCertification, setCourseCertification] = useState("Certified Developer");
  const [courseEligibility, setCourseEligibility] = useState("Any Graduate");
  const [coursePlacement, setCoursePlacement] = useState(true);
  const [courseSyllabusVal, setCourseSyllabusVal] = useState("");
  const [courseSyllabusList, setCourseSyllabusList] = useState([]);

  const [toastMsg, setToastMsg] = useState(null);

  const triggerToast = (type, text) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchInstitutes = async () => {
    try {
      const res = await fetch("/api/institutes");
      if (res.ok) {
        const data = await res.json();
        setInstitutes(data);
      }
    } catch (err) {
      console.error("Error loading institutes:", err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Error loading inquiries:", err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchInstitutes(), fetchInquiries()]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const handleOpenCreateForm = () => {
    setFormId("");
    setName("");
    setLogo("https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=120&q=80");
    setCoverImage("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80");
    setDescription("");
    setEstablishedYear(2020);
    setPhone("+91 ");
    setEmail("");
    setWebsite("");
    setWhatsapp("+91 ");
    setAddress("");
    setCity("Pune");
    setState("Maharashtra");
    setPlacementRecord("");
    setPracticalLabs(true);
    setCategories(["programming"]);
    setInfraList([]);
    setCoursesList([]);
    setShowForm(true);
  };

  const handleOpenEditForm = (inst) => {
    setFormId(inst.id);
    setName(inst.name);
    setLogo(inst.logo);
    setCoverImage(inst.coverImage);
    setDescription(inst.description);
    setEstablishedYear(inst.establishedYear);
    setPhone(inst.phone);
    setEmail(inst.email);
    setWebsite(inst.website);
    setWhatsapp(inst.whatsapp);
    setAddress(inst.address);
    setCity(inst.city);
    setState(inst.state);
    setPlacementRecord(inst.placementRecord);
    setPracticalLabs(inst.practicalLabs);
    setCategories(inst.categories);
    setInfraList(inst.infrastructure || []);
    setCoursesList(inst.courses || []);
    setShowForm(true);
  };

  const handleDeleteInstitute = async (id) => {
    if (!window.confirm("Are you sure you want to delete this institute? This will delete all course configurations and user reviews.")) return;
    try {
      const res = await fetch(`/api/admin/institutes/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        triggerToast("success", "Institute deleted successfully!");
        fetchInstitutes();
      } else {
        triggerToast("error", "Failed to delete institute.");
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleUpdateInquiryStatus = async (inqId, newStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${inqId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        triggerToast("success", `Inquiry updated to: ${newStatus}`);
        fetchInquiries();
      } else {
        triggerToast("error", "Failed to update inquiry.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleAddInfra = () => {
    if (infraInput.trim() && !infraList.includes(infraInput.trim())) {
      setInfraList([...infraList, infraInput.trim()]);
      setInfraInput("");
    }
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseTrainer.trim()) {
      alert("Please fill Course Title and Trainer Name.");
      return;
    }

    const newCourseObj = {
      id: "inst-course-" + Date.now(),
      title: courseTitle,
      category: courseCategory,
      duration: courseDuration,
      mode: courseMode,
      fees: parseInt(courseFees) || 20000,
      batchTimings: courseTimings,
      startDate: new Date(),
      trainerName: courseTrainer,
      certification: courseCertification,
      eligibility: courseEligibility,
      syllabus: courseSyllabusList,
      placementAssistance: coursePlacement
    };

    setCoursesList([...coursesList, newCourseObj]);
    setShowCourseForm(false);
    // Reset course form fields
    setCourseTitle("");
    setCourseTrainer("");
    setCourseSyllabusList([]);
  };

  const handleAddSyllabusModule = () => {
    if (courseSyllabusVal.trim() && !courseSyllabusList.includes(courseSyllabusVal.trim())) {
      setCourseSyllabusList([...courseSyllabusList, courseSyllabusVal.trim()]);
      setCourseSyllabusVal("");
    }
  };

  const handleSaveInstituteSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !phone || !email || !address) {
      triggerToast("error", "Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        id: formId || undefined,
        name,
        logo,
        coverImage,
        description,
        establishedYear,
        categories,
        phone,
        email,
        website,
        whatsapp,
        address,
        city,
        state,
        infrastructure: infraList,
        practicalLabs,
        placementRecord,
        courses: coursesList
      };

      const res = await fetch("/api/admin/institutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerToast("success", formId ? "Institute profile updated!" : "Coaching institute created successfully!");
        setShowForm(false);
        fetchInstitutes();
      } else {
        triggerToast("error", "Failed to save profile.");
      }
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  return (
    <div className="offline-admin-page page-container">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className={`toast-alert glass-panel fade-in ${toastMsg.type}`}>
          <span>{toastMsg.text}</span>
        </div>
      )}

      <div className="admin-header fade-in">
        <div className="header-meta">
          <Settings size={20} color="var(--primary)" />
          <span>Workspace Console</span>
        </div>
        <h1>Offline Classes Management Center</h1>
        <p>Maintain listings of training centers, schedules, batch timings, fees structures, and respond to student demo bookings.</p>
      </div>

      {/* Tabs list */}
      <div className="admin-tabs-row glass-panel fade-in">
        <button 
          className={`tab-btn ${activeTab === "institutes" ? "active" : ""}`}
          onClick={() => { setActiveTab("institutes"); setShowForm(false); }}
        >
          <Layers size={16} />
          <span>Manage Institutes ({institutes.length})</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === "inquiries" ? "active" : ""}`}
          onClick={() => { setActiveTab("inquiries"); setShowForm(false); }}
        >
          <Mail size={16} />
          <span>Student Inquiries ({inquiries.length})</span>
        </button>
      </div>

      {/* Main Workspace Display */}
      {loading ? (
        <div className="admin-loading glass-panel">
          <Clock className="animate-spin" size={40} color="var(--primary)" />
          <p>Syncing panel configurations...</p>
        </div>
      ) : activeTab === "institutes" ? (
        
        <div className="institutes-admin-workspace fade-in">
          
          {!showForm ? (
            <>
              <div className="action-row">
                <button onClick={handleOpenCreateForm} className="btn-primary">
                  <Plus size={16} />
                  <span>Register Coaching Institute</span>
                </button>
              </div>

              <div className="institutes-admin-table-wrapper glass-panel">
                {institutes.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Logo</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Courses Offered</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {institutes.map(inst => (
                        <tr key={inst.id}>
                          <td>
                            <img src={inst.logo} alt={inst.name} className="admin-table-logo" />
                          </td>
                          <td>
                            <strong className="table-inst-name">{inst.name}</strong>
                            <span className="table-inst-year">Est. {inst.establishedYear}</span>
                          </td>
                          <td>
                            <span className="table-inst-city">{inst.city}, {inst.state}</span>
                          </td>
                          <td>
                            <span className="table-inst-courses">{inst.courses.length} courses</span>
                          </td>
                          <td>
                            <div className="table-inst-rating">⭐ {inst.rating}</div>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button onClick={() => handleOpenEditForm(inst)} className="action-btn edit" title="Edit Profile">
                                <Edit size={14} />
                              </button>
                              <button onClick={() => handleDeleteInstitute(inst.id)} className="action-btn delete" title="Delete Profile">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-table-state">
                    <p>No registered institutes. Click the button above to add the first coaching profile.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            
            // Register / Edit Form Panel
            <div className="institute-form-panel glass-panel">
              <div className="form-header">
                <h2>{formId ? `Edit: ${name}` : "Register New Institute"}</h2>
                <button onClick={() => setShowForm(false)} className="btn-close"><X size={18} /></button>
              </div>

              <form onSubmit={handleSaveInstituteSubmit} className="admin-profile-form">
                
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Institute Name *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="form-grid-2-inner">
                    <div className="form-field">
                      <label>Year Established</label>
                      <input type="number" value={establishedYear} onChange={(e) => setEstablishedYear(parseInt(e.target.value))} />
                    </div>
                    <div className="form-field">
                      <label>Practical Labs</label>
                      <select value={practicalLabs ? "yes" : "no"} onChange={(e) => setPracticalLabs(e.target.value === "yes")}>
                        <option value="yes">Yes, Fully Equipped</option>
                        <option value="no">No Labs</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Logo Image URL *</label>
                    <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label>Cover Photo URL *</label>
                    <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} required />
                  </div>
                </div>

                <div className="form-field">
                  <label>Description / About *</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required placeholder="Detailed about summary of facilities and courses..." />
                </div>

                <div className="form-grid-4">
                  <div className="form-field">
                    <label>Contact Phone *</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label>Email Address *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label>Official Website</label>
                    <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                  <div className="form-field">
                    <label>WhatsApp Contact</label>
                    <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-field flex-2">
                    <label>Campus Physical Address *</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label>City *</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="form-select">
                      <option value="Pune">Pune</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Gurugram">Gurugram</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>State *</label>
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
                  </div>
                </div>

                <div className="form-field">
                  <label>Placement Records Text</label>
                  <input type="text" value={placementRecord} onChange={(e) => setPlacementRecord(e.target.value)} placeholder="e.g. 85% selection assistant record" />
                </div>

                {/* Categories Checkbox selection */}
                <div className="form-field">
                  <label>Subject Domain Categories</label>
                  <div className="category-checkboxes">
                    {[
                      { val: "programming", label: "Programming & IT" },
                      { val: "datascience", label: "Data Science" },
                      { val: "design", label: "UI/UX & Design" },
                      { val: "cybersecurity", label: "Cyber Security" },
                      { val: "cloudcomputing", label: "Cloud & DevOps" },
                      { val: "government", label: "Government Exams" }
                    ].map(cat => {
                      const checked = categories.includes(cat.val);
                      return (
                        <label key={cat.val} className="checkbox-container">
                          <input 
                            type="checkbox" 
                            checked={checked} 
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCategories([...categories, cat.val]);
                              } else {
                                setCategories(categories.filter(c => c !== cat.val));
                              }
                            }}
                          />
                          <span className="checkmark"></span>
                          <span>{cat.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Infrastructure Tags */}
                <div className="form-field">
                  <label>Infrastructure & Facilities List</label>
                  <div className="input-wrap">
                    <input 
                      type="text" 
                      placeholder="e.g. Wi-Fi, Discussion Room" 
                      value={infraInput} 
                      onChange={(e) => setInfraInput(e.target.value)} 
                    />
                    <button type="button" onClick={handleAddInfra} className="btn-add">Add Facility</button>
                  </div>
                  <div className="tags-preview">
                    {infraList.map((tag, idx) => (
                      <span key={idx} className="pro-tag-item">
                        {tag} <X size={12} onClick={() => setInfraList(infraList.filter(t => t !== tag))} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Classes & Batches Offered Sub-form */}
                <div className="courses-subform-section">
                  <div className="subform-header">
                    <h3>Courses Roster ({coursesList.length})</h3>
                    <button type="button" onClick={() => setShowCourseForm(true)} className="btn-secondary">
                      <Plus size={14} /> Add Course Offered
                    </button>
                  </div>

                  {showCourseForm && (
                    <div className="inner-course-form glass-panel">
                      <h4>New Course Details</h4>
                      <div className="form-grid-2">
                        <div className="form-field">
                          <label>Course Title *</label>
                          <input type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                        </div>
                        <div className="form-grid-2-inner">
                          <div className="form-field">
                            <label>Domain Category</label>
                            <select value={courseCategory} onChange={(e) => setCourseCategory(e.target.value)}>
                              <option value="programming">Programming</option>
                              <option value="datascience">Data Science</option>
                              <option value="design">UI/UX Design</option>
                              <option value="cybersecurity">Cyber Security</option>
                              <option value="cloudcomputing">Cloud & DevOps</option>
                              <option value="government">Government Exams</option>
                            </select>
                          </div>
                          <div className="form-field">
                            <label>Learning Mode</label>
                            <select value={courseMode} onChange={(e) => setCourseMode(e.target.value)}>
                              <option value="Offline">Offline Class</option>
                              <option value="Hybrid">Hybrid Model</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-grid-3">
                        <div className="form-field">
                          <label>Duration</label>
                          <input type="text" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} />
                        </div>
                        <div className="form-field">
                          <label>Fees (INR) *</label>
                          <input type="number" value={courseFees} onChange={(e) => setCourseFees(parseInt(e.target.value))} />
                        </div>
                        <div className="form-field">
                          <label>Instructor Name</label>
                          <input type="text" value={courseTrainer} onChange={(e) => setCourseTrainer(e.target.value)} />
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-field">
                          <label>Batch Timings</label>
                          <input type="text" value={courseTimings} onChange={(e) => setCourseTimings(e.target.value)} />
                        </div>
                        <div className="form-field">
                          <label>Certification Title</label>
                          <input type="text" value={courseCertification} onChange={(e) => setCourseCertification(e.target.value)} />
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-field">
                          <label>Course Syllabus Module</label>
                          <div className="input-wrap">
                            <input 
                              type="text" 
                              placeholder="e.g. React.js architecture" 
                              value={courseSyllabusVal}
                              onChange={(e) => setCourseSyllabusVal(e.target.value)}
                            />
                            <button type="button" onClick={handleAddSyllabusModule} className="btn-add">Add Module</button>
                          </div>
                          <div className="tags-preview">
                            {courseSyllabusList.map((tag, idx) => (
                              <span key={idx} className="pro-tag-item">
                                {tag} <X size={12} onClick={() => setCourseSyllabusList(courseSyllabusList.filter(t => t !== tag))} />
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="form-field">
                          <label>Placement Assistance</label>
                          <select value={coursePlacement ? "yes" : "no"} onChange={(e) => setCoursePlacement(e.target.value === "yes")}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                      </div>

                      <div className="inner-form-actions">
                        <button type="button" onClick={handleAddCourse} className="btn-primary">Save Course to Roster</button>
                        <button type="button" onClick={() => setShowCourseForm(false)} className="btn-secondary">Cancel</button>
                      </div>
                    </div>
                  )}

                  <div className="courses-table-preview">
                    {coursesList.length > 0 ? (
                      <table className="mini-table">
                        <thead>
                          <tr>
                            <th>Course Title</th>
                            <th>Mode</th>
                            <th>Duration</th>
                            <th>Fees</th>
                            <th>Trainer</th>
                            <th>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coursesList.map((c, i) => (
                            <tr key={i}>
                              <td><strong>{c.title}</strong></td>
                              <td>{c.mode}</td>
                              <td>{c.duration}</td>
                              <td>₹{c.fees.toLocaleString("en-IN")}</td>
                              <td>{c.trainerName}</td>
                              <td>
                                <button 
                                  type="button" 
                                  onClick={() => setCoursesList(coursesList.filter(item => item.id !== c.id))} 
                                  className="action-btn delete"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="no-courses-tip">No courses listed yet. Click "Add Course Offered" to list certifications.</p>
                    )}
                  </div>

                </div>

                <div className="form-actions-row">
                  <button type="submit" className="btn-primary">
                    {formId ? "Save Profile Details" : "Register Institute Profile"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                </div>

              </form>
            </div>

          )}

        </div>

      ) : (
        
        // Tab B: Student Inquiries panel list
        <div className="inquiries-admin-workspace fade-in">
          <div className="inquiries-table-wrapper glass-panel">
            {inquiries.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Email</th>
                    <th>Institute</th>
                    <th>Course Class</th>
                    <th>Type</th>
                    <th>Submitted Date</th>
                    <th>Current Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map(inq => (
                    <tr key={inq._id}>
                      <td>
                        <strong className="student-email">{inq.userEmail}</strong>
                        {inq.message && <p className="student-notes">Notes: "{inq.message}"</p>}
                      </td>
                      <td>
                        <span className="inq-inst">{inq.instituteName}</span>
                      </td>
                      <td>
                        <span className="inq-course">{inq.courseName || "General Institute Inquiry"}</span>
                      </td>
                      <td>
                        <span className={`inq-badge-type ${inq.type}`}>{inq.type}</span>
                      </td>
                      <td>
                        <span className="inq-date">{new Date(inq.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}</span>
                      </td>
                      <td>
                        <span className={`status-tag ${inq.status.toLowerCase()}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          value={inq.status} 
                          onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                          className="status-selector"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-table-state">
                <p>No student inquiries submitted yet.</p>
              </div>
            )}
          </div>
        </div>

      )}

      <style dangerouslySetInnerHTML={{__html: `
        .offline-admin-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .admin-header {
          margin-bottom: 30px;
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .admin-header h1 {
          font-size: 2.2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 60%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
        }

        .admin-header p {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.5;
          max-width: 600px;
        }

        /* Tabs list */
        .admin-tabs-row {
          display: flex;
          gap: 12px;
          padding: 12px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          padding: 10px 20px;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .tab-btn:hover, .tab-btn.active {
          color: var(--primary);
          background: var(--primary-light);
        }

        .action-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }

        /* Tables */
        .institutes-admin-table-wrapper, .inquiries-table-wrapper {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-table th, .admin-table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.88rem;
        }

        .admin-table th {
          font-weight: 800;
          color: var(--text-primary);
          background: rgba(255,255,255,0.4);
          text-transform: uppercase;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
        }

        .admin-table-logo {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
        }

        .table-inst-name {
          display: block;
          color: var(--text-primary);
          font-weight: 700;
        }

        .table-inst-year {
          display: block;
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .table-inst-city, .table-inst-courses {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .table-inst-rating {
          font-weight: 700;
          color: var(--text-primary);
        }

        .table-actions {
          display: flex;
          gap: 6px;
        }

        .action-btn {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .action-btn.edit {
          color: var(--primary);
        }

        .action-btn.edit:hover {
          background: var(--primary);
          color: #FFFFFF;
          border-color: var(--primary);
        }

        .action-btn.delete {
          color: var(--error);
        }

        .action-btn.delete:hover {
          background: var(--error);
          color: #FFFFFF;
          border-color: var(--error);
        }

        /* Inquiries styles */
        .student-email {
          color: var(--text-primary);
          display: block;
        }

        .student-notes {
          font-size: 0.78rem;
          color: var(--text-secondary);
          background: rgba(15, 23, 42, 0.04);
          padding: 6px 10px;
          border-radius: 4px;
          margin-top: 4px;
          font-style: italic;
          max-width: 320px;
        }

        .inq-badge-type {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }

        .inq-badge-type.callback { background: rgba(29, 92, 255, 0.1); color: var(--primary); }
        .inq-badge-type.demo { background: rgba(144, 85, 255, 0.1); color: var(--accent-purple); }
        .inq-badge-type.visit { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .inq-badge-type.inquiry { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

        .status-tag {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .status-tag.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-tag.contacted { background: rgba(29, 92, 255, 0.1); color: var(--primary); }
        .status-tag.completed { background: rgba(16, 185, 129, 0.1); color: #10b981; }

        .status-selector {
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          color: var(--text-primary);
          font-size: 0.8rem;
          font-weight: 600;
          outline: none;
        }

        /* Admin form panel */
        .institute-form-panel {
          padding: 28px;
          background: var(--bg-glass);
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 14px;
          margin-bottom: 24px;
        }

        .form-header h2 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .btn-close {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .admin-profile-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-grid-2-inner {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .form-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 768px) {
          .form-grid-2, .form-grid-3, .form-grid-4 {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field.flex-2 {
          grid-column: span 2;
        }

        @media (max-width: 768px) {
          .form-field.flex-2 {
            grid-column: span 1;
          }
        }

        .form-field label {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .form-field input, .form-field select, .form-field textarea {
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: #FFFFFF;
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
        }

        .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
          border-color: var(--primary);
        }

        .category-checkboxes {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          background: var(--bg-secondary);
          padding: 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        @media (max-width: 600px) {
          .category-checkboxes {
            grid-template-columns: 1fr;
          }
        }

        /* Courses sub-form */
        .courses-subform-section {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          padding: 20px;
          margin-top: 10px;
        }

        .subform-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .subform-header h3 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .inner-course-form {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          padding: 20px;
          margin-bottom: 20px;
        }

        .inner-course-form h4 {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 16px;
          border-left: 3px solid var(--primary);
          padding-left: 8px;
        }

        .inner-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 14px;
        }

        .mini-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }

        .mini-table th, .mini-table td {
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-color);
          text-align: left;
        }

        .no-courses-tip {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: center;
          margin: 12px 0;
        }

        .form-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
          margin-top: 10px;
        }

        .admin-loading {
          padding: 100px 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: var(--text-secondary);
        }

        .empty-table-state {
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
        }
      `}} />
    </div>
  );
}
