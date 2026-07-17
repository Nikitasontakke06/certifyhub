import React, { useState, useEffect } from "react";
import { getAuthHeaders } from "../utils/auth";
import StateFeedback from "../components/StateFeedback";
import { 
  Globe, 
  Brain, 
  Cloud, 
  Shield, 
  Layout, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  TrendingUp, 
  IndianRupee, 
  Compass, 
  Sparkles,
  BookOpen,
  Check
} from "lucide-react";

// Predefined Roadmap Structure
const ROADMAP_DATA = [
  {
    id: "fullstack",
    title: "Full Stack Web Developer",
    description: "Build complete end-to-end web applications. Learn how to construct frontends using React, build backend APIs with Node.js/Express, and manage databases like MongoDB and SQL.",
    icon: "Globe",
    salary: "₹6 - ₹18 LPA",
    growth: "+14.2% YoY",
    difficulty: "Medium",
    color: "linear-gradient(135deg, rgba(29, 92, 255, 0.08) 0%, rgba(56, 189, 248, 0.08) 100%)",
    borderColor: "rgba(29, 92, 255, 0.25)",
    accentColor: "var(--primary)",
    steps: [
      {
        id: "fs-step-1",
        title: "Stage 1: Programming Foundations",
        description: "Learn core computer programming principles, syntax, variables, conditionals, loops, and logic building. Acquire solid fundamentals using Python or Java.",
        duration: "4-6 weeks",
        skills: ["Logic Building", "Loops & Control Flows", "Variables & Types", "Basic Algorithms"],
        courseFilter: { category: "programming", level: "Beginner" }
      },
      {
        id: "fs-step-2",
        title: "Stage 2: Responsive Frontend Design",
        description: "Master user interface design structures, typographic layouts, styling properties, and responsive alignments using HTML5, CSS3, and modern design frameworks.",
        duration: "6-8 weeks",
        skills: ["HTML5", "CSS3 Layouts", "Flexbox & Grid", "UI Design Principles"],
        courseFilter: { category: "design", keywords: ["Photoshop", "UX", "UI", "Web"] }
      },
      {
        id: "fs-step-3",
        title: "Stage 3: Advanced Frontend & JavaScript Core",
        description: "Transition from styling to scripting. Understand modern JavaScript (ES6+), DOM operations, and build single-page apps using React framework.",
        duration: "8-10 weeks",
        skills: ["JavaScript ES6+", "DOM Manipulation", "React Components", "Fetch & APIs"],
        courseFilter: { category: "programming", keywords: ["Web", "MERN", "React", "Full Stack"] }
      },
      {
        id: "fs-step-4",
        title: "Stage 4: Databases & SQL Fundamentals",
        description: "Explore data storage management, schema modeling, query optimization, and structured vs unstructured databases.",
        duration: "4-6 weeks",
        skills: ["SQL Queries", "Database Design", "Relational Schemas", "NoSQL Concepts"],
        courseFilter: { keywords: ["SQL", "Database"] }
      },
      {
        id: "fs-step-5",
        title: "Stage 5: Full Stack API & Server Integration",
        description: "Construct backend RESTful APIs, manage secure authentication tokens, verify DB connections, and deploy projects to cloud instances.",
        duration: "10-12 weeks",
        skills: ["Node.js API", "Express Server", "MongoDB Models", "JWT Security"],
        courseFilter: { category: "programming", level: "All Levels", keywords: ["Full Stack", "MERN", "Bootcamp"] }
      }
    ]
  },
  {
    id: "datascience",
    title: "Data Scientist & AI Engineer",
    description: "Extract insights from complex datasets and construct predictive models. Master statistics, SQL data pipelines, and machine learning neural networks.",
    icon: "Brain",
    salary: "₹8 - ₹24 LPA",
    growth: "+18.7% YoY",
    difficulty: "High",
    color: "linear-gradient(135deg, rgba(144, 85, 255, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)",
    borderColor: "rgba(144, 85, 255, 0.25)",
    accentColor: "var(--accent-purple)",
    steps: [
      {
        id: "ds-step-1",
        title: "Stage 1: Python Core Foundations",
        description: "Understand foundational Python coding conventions, object-oriented concepts, and basic logic writing.",
        duration: "4-6 weeks",
        skills: ["Python Scripting", "Data Structures", "Functions", "OOP Basics"],
        courseFilter: { category: "programming", level: "Beginner", keywords: ["Python"] }
      },
      {
        id: "ds-step-2",
        title: "Stage 2: Database Operations & SQL",
        description: "Learn to query, structure, and manipulate relational databases, which is vital for gathering raw analytics datasets.",
        duration: "4 weeks",
        skills: ["SQL Joins", "Aggregations", "Table Schemas", "Query Optimization"],
        courseFilter: { keywords: ["SQL", "Database"] }
      },
      {
        id: "ds-step-3",
        title: "Stage 3: Data Analytics & Libraries",
        description: "Gain hands-on experience cleansing data and building mathematical visualizations using NumPy, Pandas, Matplotlib, and Seaborn.",
        duration: "6-8 weeks",
        skills: ["Pandas Dataframes", "NumPy Operations", "Data Visualization", "Exploratory Data Analysis"],
        courseFilter: { category: "datascience", level: "Beginner" }
      },
      {
        id: "ds-step-4",
        title: "Stage 4: Machine Learning Pipelines",
        description: "Implement supervised and unsupervised learning algorithms (Linear Regression, Decision Trees, K-Means) using Scikit-Learn.",
        duration: "8-10 weeks",
        skills: ["Scikit-Learn", "Model Evaluation", "Regression & Classification", "Feature Engineering"],
        courseFilter: { category: "datascience", level: "Intermediate", keywords: ["Machine Learning", "ML"] }
      },
      {
        id: "ds-step-5",
        title: "Stage 5: Deep Learning & AI Models",
        description: "Build neural networks, train computer vision projects, and create generative NLP applications using TensorFlow or PyTorch.",
        duration: "10-12 weeks",
        skills: ["Neural Networks", "TensorFlow / PyTorch", "Deep Learning Models", "Natural Language Processing"],
        courseFilter: { category: "aiml" }
      }
    ]
  },
  {
    id: "clouddevops",
    title: "Cloud & DevOps Architect",
    description: "Design highly-available cloud infrastructures and automate deployment channels. Master container orchestration, system monitoring, and CI/CD automation.",
    icon: "Cloud",
    salary: "₹7 - ₹22 LPA",
    growth: "+15.9% YoY",
    difficulty: "Medium-High",
    color: "linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(29, 78, 216, 0.08) 100%)",
    borderColor: "rgba(20, 184, 166, 0.25)",
    accentColor: "var(--accent-cyan)",
    steps: [
      {
        id: "cd-step-1",
        title: "Stage 1: System Admin & OS Basics",
        description: "Learn Linux terminal navigation, shell scripting, storage configuration, and core networking protocols.",
        duration: "4 weeks",
        skills: ["Linux CLI", "Shell Scripting", "Networking Protocols (TCP/IP)", "DNS & Ports"],
        courseFilter: { category: "programming", level: "Beginner" }
      },
      {
        id: "cd-step-2",
        title: "Stage 2: Core Cloud Providers",
        description: "Learn infrastructure provisioning, virtual machines, IAM permissions, and storage options in AWS or Azure platforms.",
        duration: "6-8 weeks",
        skills: ["AWS Console", "Azure Administration", "Virtual Networking (VPC)", "IAM Security policies"],
        courseFilter: { category: "cloudcomputing", level: "Beginner" }
      },
      {
        id: "cd-step-3",
        title: "Stage 3: Containerization & Docker",
        description: "Understand package isolation, environment consistency, and building microservices images using Docker.",
        duration: "4-6 weeks",
        skills: ["Docker Images", "Containers Management", "Docker Compose", "Multi-stage Builds"],
        courseFilter: { category: "cloudcomputing", level: "Intermediate" }
      },
      {
        id: "cd-step-4",
        title: "Stage 4: Infrastructure as Code & Orchestration",
        description: "Provision servers systematically using Terraform, and orchestrate containerized scaling with Kubernetes clusters.",
        duration: "8-10 weeks",
        skills: ["Kubernetes (K8s)", "Terraform IaC", "Helm Charts", "Auto-scaling"],
        courseFilter: { category: "cloudcomputing", level: "Advanced" }
      },
      {
        id: "cd-step-5",
        title: "Stage 5: Continuous Integration (CI/CD) Pipelines",
        description: "Construct delivery automation flows, integrate quality analysis tests, and secure deployment keys using GitHub Actions.",
        duration: "6-8 weeks",
        skills: ["GitHub Actions", "Jenkins Pipelines", "Monitoring (Prometheus)", "Security Scanning (DevSecOps)"],
        courseFilter: { category: "cloudcomputing", keywords: ["Cloud", "DevOps", "Architect"] }
      }
    ]
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Specialist",
    description: "Defend corporate networks, verify system flaws, and mitigate penetration threats. Master ethical hacking, malware response, and secure network infrastructure design.",
    icon: "Shield",
    salary: "₹6 - ₹20 LPA",
    growth: "+12.8% YoY",
    difficulty: "High",
    color: "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(249, 115, 22, 0.08) 100%)",
    borderColor: "rgba(239, 68, 68, 0.25)",
    accentColor: "#ef4444",
    steps: [
      {
        id: "cs-step-1",
        title: "Stage 1: OS, Shells & Networking Foundations",
        description: "Understand OS kernels, secure firewall routing, terminal operations, and packet transfer rules.",
        duration: "4-6 weeks",
        skills: ["Linux & Windows Administration", "TCP/IP Networking", "Port Scanning", "SSH / Shell operations"],
        courseFilter: { category: "programming", level: "Beginner" }
      },
      {
        id: "cs-step-2",
        title: "Stage 2: Security & Encryption Fundamentals",
        description: "Examine security frameworks, symmetric/asymmetric encryption, hashing, and access control models.",
        duration: "4 weeks",
        skills: ["Cryptography basics", "Access Control List (ACL)", "Security Policies", "Risk Assessment"],
        courseFilter: { category: "cybersecurity", level: "Beginner" }
      },
      {
        id: "cs-step-3",
        title: "Stage 3: Penetration Testing & Hacking",
        description: "Simulate threat attacks, inspect SQL injection flaws, execute cross-site scripting (XSS), and explore Kali Linux tools.",
        duration: "8-10 weeks",
        skills: ["OWASP Top 10", "Metasploit", "Vulnerability Scanning", "Kali Linux utilities"],
        courseFilter: { category: "cybersecurity", level: "Intermediate" }
      },
      {
        id: "cs-step-4",
        title: "Stage 4: Incident Response & Threat Hunting",
        description: "Implement intrusion detection systems, analyze security log trends, and compile post-mortem forensics diagnostics.",
        duration: "6-8 weeks",
        skills: ["SIEM (Splunk)", "Log Analysis", "Malware Analysis", "Forensics Basics"],
        courseFilter: { category: "cybersecurity", level: "Advanced" }
      },
      {
        id: "cs-step-5",
        title: "Stage 5: Cloud Security & Governance",
        description: "Architect secure microservices environments, verify compliance certificates, and manage secure credential endpoints.",
        duration: "6 weeks",
        skills: ["DevSecOps Integration", "AWS Security groups", "GDPR & HIPAA Compliance", "Credential Storage"],
        courseFilter: { category: "cybersecurity", keywords: ["Cloud", "DevOps", "Ethical", "Security"] }
      }
    ]
  },
  {
    id: "uiux",
    title: "Product UI/UX Designer",
    description: "Design intuitive user interfaces and user-centered products. Master design systems, wireframing, interactive prototyping, and feedback testing methodologies.",
    icon: "Layout",
    salary: "₹5 - ₹15 LPA",
    growth: "+10.5% YoY",
    difficulty: "Low-Medium",
    color: "linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(249, 115, 22, 0.08) 100%)",
    borderColor: "rgba(236, 72, 153, 0.25)",
    accentColor: "var(--accent-purple)",
    steps: [
      {
        id: "ux-step-1",
        title: "Stage 1: Visual Design Principles",
        description: "Learn color theory, alignment structures, typography hierarchy, and visual branding foundations.",
        duration: "4 weeks",
        skills: ["Color Palette Design", "Typography Rules", "Grid Systems", "Composition Rules"],
        courseFilter: { category: "design", level: "Beginner" }
      },
      {
        id: "ux-step-2",
        title: "Stage 2: User Experience (UX) Research",
        description: "Conduct user survey inquiries, create personas, outline navigation flows, and draft low-fidelity structural maps.",
        duration: "6-8 weeks",
        skills: ["User Interviews", "User Personas", "Information Architecture", "Wireframing"],
        courseFilter: { category: "design", keywords: ["UX", "Google", "Research"] }
      },
      {
        id: "ux-step-3",
        title: "Stage 3: Advanced UI & Prototyping (Figma)",
        description: "Construct interactive component design systems, build interactive layouts, and define transitions in Figma.",
        duration: "6-8 weeks",
        skills: ["Figma Component libraries", "Auto Layout", "Interactive Prototypes", "Micro-interactions"],
        courseFilter: { category: "design", level: "Intermediate" }
      },
      {
        id: "ux-step-4",
        title: "Stage 4: Usability Testing & Iteration",
        description: "Deploy design structures for user evaluation tests, study click heatmaps, and perform A/B testing layouts.",
        duration: "4 weeks",
        skills: ["Usability testing", "Feedback Collection", "Design Handoff", "A/B Testing UI"],
        courseFilter: { category: "design", level: "Advanced" }
      },
      {
        id: "ux-step-5",
        title: "Stage 5: Frontend Design Integration",
        description: "Bridge the gap between design and coding by learning responsive HTML/CSS structures and design token translation.",
        duration: "4-6 weeks",
        skills: ["HTML5 Layouts", "CSS Grid/Flexbox", "Design Tokens", "Bootstrap/Tailwind basics"],
        courseFilter: { category: "programming", level: "Beginner", keywords: ["Web", "HTML", "CSS"] }
      }
    ]
  }
];

// Helper to render icon component based on name
const renderRoadmapIcon = (iconName, size = 26, color = "var(--primary)") => {
  switch (iconName) {
    case "Globe": return <Globe size={size} color={color} />;
    case "Brain": return <Brain size={size} color={color} />;
    case "Cloud": return <Cloud size={size} color={color} />;
    case "Shield": return <Shield size={size} color={color} />;
    case "Layout": return <Layout size={size} color={color} />;
    default: return <Compass size={size} color={color} />;
  }
};

export default function RoadmapsPage({ user, courses = [] }) {
  const [selectedRoadmap, setSelectedRoadmap] = useState(ROADMAP_DATA[0]);
  const [progress, setProgress] = useState({ completedSteps: [], completedCourses: [] });
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Fetch roadmap completion progress for logged-in user
  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      setLoadingProgress(true);
      try {
        const res = await fetch(`/api/roadmap-progress/${selectedRoadmap.id}`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          setProgress(data);
        }
      } catch (err) {
        console.error("Error loading roadmap progress:", err);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [selectedRoadmap.id, user]);

  // Toggle step completion status
  const handleToggleStep = async (stepId) => {
    if (!user) return;
    setTogglingId(stepId);
    try {
      const res = await fetch(`/api/roadmap-progress/${selectedRoadmap.id}/toggle-step`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ stepId })
      });
      if (res.ok) {
        const updated = await res.json();
        setProgress(updated);
      }
    } catch (err) {
      console.error("Error toggling step progress:", err);
    } finally {
      setTogglingId(null);
    }
  };

  // Toggle specific course completion status
  const handleToggleCourse = async (courseId) => {
    if (!user) return;
    setTogglingId(courseId);
    try {
      const res = await fetch(`/api/roadmap-progress/${selectedRoadmap.id}/toggle-course`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ courseId })
      });
      if (res.ok) {
        const updated = await res.json();
        setProgress(updated);
      }
    } catch (err) {
      console.error("Error toggling course progress:", err);
    } finally {
      setTogglingId(null);
    }
  };

  // Helper to dynamically filter courses for a step
  const getStepCourses = (step) => {
    const filter = step.courseFilter;
    if (!filter) return [];

    return courses.filter(course => {
      // 1. Check category
      if (filter.category && course.category !== filter.category) {
        return false;
      }
      // 2. Check level (Beginner/Intermediate/Advanced)
      if (filter.level && course.level !== filter.level && course.level !== "All Levels") {
        return false;
      }
      // 3. Check text keywords
      if (filter.keywords) {
        const title = course.title.toLowerCase();
        const desc = course.description.toLowerCase();
        const matchesKeyword = filter.keywords.some(keyword => 
          title.includes(keyword.toLowerCase()) || desc.includes(keyword.toLowerCase())
        );
        if (!matchesKeyword) return false;
      }
      return true;
    }).slice(0, 3); // Return top 3 matched courses
  };

  // Calculate overall roadmap progress percentage
  const getProgressPercentage = () => {
    if (!selectedRoadmap || !selectedRoadmap.steps) return 0;
    
    // Count steps & course requirements
    const totalSteps = selectedRoadmap.steps.length;
    let completedCount = progress.completedSteps.length;
    
    // Weight courses at 50% and stages at 50%
    const totalCourseInstances = selectedRoadmap.steps.reduce((sum, step) => sum + getStepCourses(step).length, 0);
    const completedCoursesCount = progress.completedCourses.filter(cid => 
      selectedRoadmap.steps.some(step => getStepCourses(step).some(c => c.id === cid))
    ).length;

    if (totalSteps === 0) return 0;
    
    const stepsWeight = (completedCount / totalSteps) * 50;
    const coursesWeight = totalCourseInstances > 0 ? (completedCoursesCount / totalCourseInstances) * 50 : 50;
    
    return Math.round(stepsWeight + coursesWeight);
  };

  const progressPercent = getProgressPercentage();

  return (
    <div className="roadmaps-page page-container">
      
      {/* Page Header */}
      <div className="roadmaps-header fade-in">
        <div className="header-badge">
          <Sparkles size={14} color="var(--primary)" />
          <span>Interactive Career roadmaps</span>
        </div>
        <h1>Interactive Learning Timelines</h1>
        <p>Explore step-by-step tracks to land high-demand jobs. Complete milestones, review matched certifications, and track your syllabus progress.</p>
      </div>

      {/* Grid of Roadmap Choice Options */}
      <div className="roadmap-selection-grid fade-in">
        {ROADMAP_DATA.map((path) => {
          const isSelected = selectedRoadmap.id === path.id;
          return (
            <div 
              key={path.id}
              onClick={() => setSelectedRoadmap(path)}
              className={`roadmap-option-card glass-panel ${isSelected ? "selected" : "glass-panel-hover"}`}
              style={{
                background: isSelected ? path.color : "",
                borderColor: isSelected ? path.borderColor : ""
              }}
            >
              <div className="card-top">
                <div className="icon-badge" style={{ background: isSelected ? "var(--bg-primary)" : "rgba(29, 92, 255, 0.05)" }}>
                  {renderRoadmapIcon(path.icon, 24, isSelected ? path.accentColor : "var(--text-secondary)")}
                </div>
                <ChevronRight size={16} className={`arrow-icon ${isSelected ? "active" : ""}`} />
              </div>
              <h3>{path.title}</h3>
              <p className="card-desc">{path.description.substring(0, 95)}...</p>
            </div>
          );
        })}
      </div>

      {/* Selected Roadmap Dashboard */}
      <div className="roadmap-dashboard-wrapper fade-in">
        
        {/* Left Side: Summary Card */}
        <aside className="roadmap-summary-panel glass-panel">
          <div className="summary-header">
            <div className="icon-wrapper">
              {renderRoadmapIcon(selectedRoadmap.icon, 28, selectedRoadmap.accentColor)}
            </div>
            <h2>{selectedRoadmap.title}</h2>
          </div>
          <p>{selectedRoadmap.description}</p>

          <div className="summary-metrics">
            <div className="metric-row">
              <div className="metric-lbl">
                <IndianRupee size={15} />
                <span>Salary Range</span>
              </div>
              <strong className="metric-val">{selectedRoadmap.salary}</strong>
            </div>

            <div className="metric-row">
              <div className="metric-lbl">
                <TrendingUp size={15} />
                <span>Market Growth</span>
              </div>
              <strong className="metric-val text-green">{selectedRoadmap.growth}</strong>
            </div>

            <div className="metric-row">
              <div className="metric-lbl">
                <span>Difficulty</span>
              </div>
              <strong className="metric-val">{selectedRoadmap.difficulty}</strong>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-label-row">
              <span>Roadmap Progress</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${selectedRoadmap.accentColor} 0%, var(--accent-cyan) 100%)`
                }} 
              />
            </div>
            <span className="progress-note">Weightage: 50% Stages Completed + 50% Courses Cleared.</span>
          </div>
        </aside>

        {/* Right Side: Timeline Builder */}
        <div className="roadmap-timeline-container glass-panel">
          <div className="timeline-heading">
            <BookOpen size={18} color="var(--primary)" />
            <h2>Syllabus & Career Timeline</h2>
          </div>

          {loadingProgress ? (
            <div className="timeline-loader">
              <div className="loading-spinner"></div>
              <p>Fetching your progress metrics...</p>
            </div>
          ) : (
            <div className="vertical-timeline">
              {selectedRoadmap.steps.map((step, index) => {
                const isStepCompleted = progress.completedSteps.includes(step.id);
                const stepCourses = getStepCourses(step);
                
                return (
                  <div key={step.id} className={`timeline-node ${isStepCompleted ? "completed" : ""}`}>
                    
                    {/* Visual Connector Line */}
                    <div className="timeline-connector">
                      <div className="connector-bullet" style={{ 
                        background: isStepCompleted ? selectedRoadmap.accentColor : "var(--border-color)",
                        borderColor: isStepCompleted ? selectedRoadmap.accentColor : "var(--border-color)"
                      }}>
                        {isStepCompleted ? <Check size={12} color="#FFFFFF" /> : <div className="bullet-dot" />}
                      </div>
                      {index < selectedRoadmap.steps.length - 1 && <div className="connector-line" />}
                    </div>

                    {/* Timeline Node Content Card */}
                    <div className={`timeline-content-card glass-panel ${isStepCompleted ? "completed-card" : ""}`}>
                      <div className="node-header">
                        <div className="node-info">
                          <span className="stage-badge">{step.duration}</span>
                          <h3>{step.title}</h3>
                        </div>

                        {/* Step Checkbox Toggle */}
                        <button
                          onClick={() => handleToggleStep(step.id)}
                          className={`step-complete-toggle-btn ${isStepCompleted ? "completed" : ""}`}
                          disabled={togglingId === step.id}
                          title={isStepCompleted ? "Mark Stage Incomplete" : "Mark Stage Completed"}
                        >
                          {isStepCompleted ? (
                            <CheckCircle2 size={22} color={selectedRoadmap.accentColor} fill={`${selectedRoadmap.accentColor}20`} />
                          ) : (
                            <Circle size={22} color="var(--text-muted)" />
                          )}
                        </button>
                      </div>

                      <p className="node-desc">{step.description}</p>

                      {/* Skills Acquired Tag Row */}
                      <div className="acquired-skills">
                        <strong>Target Competencies:</strong>
                        <div className="skills-badge-list">
                          {step.skills.map((skill, i) => (
                            <span key={i} className="skill-badge-tag">{skill}</span>
                          ))}
                        </div>
                      </div>

                      {/* Course Recommendations nested inside timeline step */}
                      <div className="timeline-course-recommendations">
                        <h4>Recommended Certifications ({stepCourses.length}):</h4>
                        
                        {stepCourses.length > 0 ? (
                          <div className="timeline-courses-grid">
                            {stepCourses.map((course) => {
                              const isCourseCompleted = progress.completedCourses.includes(course.id);
                              
                              return (
                                <div 
                                  key={course.id} 
                                  className={`timeline-course-card glass-panel ${isCourseCompleted ? "completed" : ""}`}
                                >
                                  <div className="tc-header">
                                    <div className="tc-provider-badge">{course.provider}</div>
                                    <span className="tc-price">
                                      {course.price === 0 ? "Free" : `₹${course.price.toLocaleString("en-IN")}`}
                                    </span>
                                  </div>
                                  <h5 title={course.title}>{course.title}</h5>
                                  
                                  <div className="tc-meta">
                                    <span>⭐ {course.rating}</span>
                                    <span>• {course.duration}</span>
                                  </div>

                                  <div className="tc-actions">
                                    <button 
                                      onClick={() => handleToggleCourse(course.id)}
                                      className={`tc-complete-btn ${isCourseCompleted ? "completed" : ""}`}
                                      disabled={togglingId === course.id}
                                    >
                                      {isCourseCompleted ? (
                                        <>
                                          <Check size={12} style={{ marginRight: 4 }} />
                                          <span>Completed</span>
                                        </>
                                      ) : (
                                        <span>Mark Done</span>
                                      )}
                                    </button>

                                    <a 
                                      href={course.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="tc-details-btn"
                                    >
                                      <span>Explore</span>
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="no-courses-tip">No matched courses in database. Try updating filters.</p>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .roadmaps-page {
          padding-bottom: 60px;
        }

        .roadmaps-header {
          margin-bottom: 40px;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(29, 92, 255, 0.08);
          border: 1px solid rgba(29, 92, 255, 0.15);
          border-radius: 100px;
          margin-bottom: 16px;
        }

        .header-badge span {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .roadmaps-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 60%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
        }

        .roadmaps-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 700px;
          line-height: 1.6;
        }

        /* Roadmap Choice Selection Cards */
        .roadmap-selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }

        .roadmap-option-card {
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          border: 1px solid var(--border-color);
        }

        .roadmap-option-card.selected {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }

        .roadmap-option-card .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .roadmap-option-card .icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .roadmap-option-card .arrow-icon {
          color: var(--text-muted);
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .roadmap-option-card.selected .arrow-icon {
          transform: translateX(2px);
          color: var(--text-primary);
        }

        .roadmap-option-card h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .roadmap-option-card .card-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Dashboard layout */
        .roadmap-dashboard-wrapper {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 968px) {
          .roadmap-dashboard-wrapper {
            grid-template-columns: 1fr;
          }
        }

        /* Summary panel styling */
        .roadmap-summary-panel {
          padding: 24px;
          position: sticky;
          top: 96px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .summary-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .summary-header .icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(29, 92, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(29, 92, 255, 0.1);
        }

        .summary-header h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .roadmap-summary-panel p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .summary-metrics {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        .metric-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .metric-lbl {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
        }

        .metric-val {
          font-weight: 600;
          color: var(--text-primary);
        }

        .metric-val.text-green {
          color: #00c853;
        }

        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .progress-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .progress-bar-bg {
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: 100px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 0.6s cubic-bezier(0.1, 0.8, 0.2, 1);
        }

        .progress-note {
          font-size: 0.7rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        /* Timeline panel styling */
        .roadmap-timeline-container {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .timeline-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }

        .timeline-heading h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .timeline-loader {
          text-align: center;
          padding: 80px 0;
          color: var(--text-secondary);
        }

        /* Vertical Timeline structure */
        .vertical-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .timeline-node {
          display: flex;
          gap: 20px;
        }

        .timeline-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 32px;
        }

        .connector-bullet {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--border-color);
          background: var(--bg-primary);
          z-index: 2;
          transition: all 0.3s ease;
        }

        .connector-bullet .bullet-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--text-muted);
        }

        .connector-line {
          width: 2px;
          flex-grow: 1;
          background: var(--border-color);
          margin: 4px 0;
        }

        .timeline-node.completed .connector-line {
          background: var(--primary);
        }

        .timeline-content-card {
          flex-grow: 1;
          padding: 24px;
          margin-bottom: 32px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .timeline-content-card.completed-card {
          border-color: rgba(29, 92, 255, 0.15);
          background: rgba(29, 92, 255, 0.01);
        }

        .node-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 16px;
        }

        .node-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stage-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          background: rgba(15, 23, 42, 0.05);
          border-radius: 100px;
          color: var(--text-secondary);
          width: fit-content;
        }

        [data-theme="dark"] .stage-badge {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
        }

        .node-info h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .step-complete-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: transform 0.2s ease, opacity 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-complete-toggle-btn:hover {
          transform: scale(1.1);
        }

        .step-complete-toggle-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .node-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .acquired-skills {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }

        .acquired-skills strong {
          font-size: 0.8rem;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .skills-badge-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-badge-tag {
          font-size: 0.75rem;
          padding: 4px 10px;
          background: rgba(29, 92, 255, 0.05);
          border: 1px solid rgba(29, 92, 255, 0.08);
          color: var(--primary);
          border-radius: 100px;
          font-weight: 500;
        }

        /* Nested courses recommendations styling */
        .timeline-course-recommendations h4 {
          font-size: 0.8rem;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 12px;
        }

        .timeline-courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .timeline-course-card {
          padding: 16px;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .timeline-course-card.completed {
          border-color: #00c85333;
          background: #00c85304;
        }

        .tc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .tc-provider-badge {
          font-weight: 700;
          color: var(--text-secondary);
        }

        .tc-price {
          font-weight: 600;
          color: var(--primary);
        }

        .timeline-course-card h5 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
          height: 38px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .tc-meta {
          display: flex;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .tc-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }

        .tc-complete-btn {
          flex-grow: 1;
          padding: 6px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .tc-complete-btn:hover {
          background: var(--bg-tertiary);
        }

        .tc-complete-btn.completed {
          background: #00c853;
          border-color: #00c853;
          color: #FFFFFF;
        }

        .tc-details-btn {
          padding: 6px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(29, 92, 255, 0.2);
          background: rgba(29, 92, 255, 0.05);
          color: var(--primary);
          border-radius: 6px;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .tc-details-btn:hover {
          background: rgba(29, 92, 255, 0.1);
        }

        .no-courses-tip, .no-bookmarks-tip {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-style: italic;
        }
      `}} />

    </div>
  );
}
