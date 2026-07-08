export const SEED_COURSES = [
  // Programming
  {
    id: "prog-udemy-1",
    title: "The Complete Python Bootcamp From Zero to Hero in Python",
    category: "programming",
    provider: "Udemy",
    price: 1499,
    rating: 4.6,
    reviewsCount: 485120,
    duration: "22 hours",
    level: "Beginner",
    link: "https://www.udemy.com/courses/search/?q=programming%20courses&src=sgp",
    description: "Learn Python like a Professional. Start from the basics and go all the way to creating your own applications and games.",
    features: ["Certificate of completion", "Full lifetime access", "15 coding exercises", "Access on mobile and TV"]
  },
  {
    id: "prog-coursera-1",
    title: "Programming for Everybody (Getting Started with Python)",
    category: "programming",
    provider: "Coursera",
    price: 3299,
    rating: 4.8,
    reviewsCount: 290150,
    duration: "12 hours (1 month)",
    level: "Beginner",
    link: "https://www.coursera.org/search?query=programming%20courses",
    description: "This course aims to teach everyone the basics of programming computers using Python.",
    features: ["Shareable certificate", "Flexible schedule", "Subtitles in 10+ languages", "Hands-on projects"]
  },
  {
    id: "prog-gl-1",
    title: "Java Programming Basics",
    category: "programming",
    provider: "Great Learning",
    price: 0,
    rating: 4.5,
    reviewsCount: 15400,
    duration: "2 hours",
    level: "Beginner",
    link: "https://www.mygreatlearning.com/academy/search?keyword=programming%20courses",
    description: "Master Java basics including variables, data types, operators, and loops to build a solid foundation.",
    features: ["Free certificate", "Self-paced learning", "1.5 hours of video content", "Lifetime access"]
  },
  {
    id: "prog-pwskills-1",
    title: "Full Stack Web Development (MERN Bootcamp)",
    category: "programming",
    provider: "PW Skills",
    price: 4999,
    rating: 4.7,
    reviewsCount: 12500,
    duration: "9 months",
    level: "Beginner",
    link: "https://pwskills.com/courses",
    description: "Comprehensive online boot camp training in HTML, CSS, JavaScript, Node.js, React.js, and SQL fundamentals.",
    features: ["Certificate of completion", "Doubt clearing support", "Industry projects", "Job portal access"]
  },
  
  // Data Science
  {
    id: "ds-udemy-1",
    title: "Python for Data Science and Machine Learning Bootcamp",
    category: "datascience",
    provider: "Udemy",
    price: 1999,
    rating: 4.7,
    reviewsCount: 125800,
    duration: "25 hours",
    level: "Intermediate",
    link: "https://www.udemy.com/courses/search/?q=data+science&src=sac&kw=data+sc",
    description: "Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Scikit-Learn, Machine Learning, and more!",
    features: ["Certificate of completion", "Lifetime access", "5 articles", "100+ lectures"]
  },
  {
    id: "ds-coursera-1",
    title: "IBM Data Science Professional Certificate",
    category: "datascience",
    provider: "Coursera",
    price: 4099,
    rating: 4.6,
    reviewsCount: 65200,
    duration: "5 months (10 hrs/week)",
    level: "Beginner",
    link: "https://www.coursera.org/search?query=data%20science",
    description: "Kickstart your career in data science. Learn SQL, Python, data visualization, and build machine learning models.",
    features: ["Professional certificate", "10 course series", "Ace job interviews", "Applied learning portfolio"]
  },
  {
    id: "ds-gl-1",
    title: "Data Science Foundations",
    category: "datascience",
    provider: "Great Learning",
    price: 0,
    rating: 4.4,
    reviewsCount: 38700,
    duration: "2 hours",
    level: "Beginner",
    link: "https://www.mygreatlearning.com/academy/search?keyword=data%20science",
    description: "An introductory course to understand what Data Science is, its lifecycle, and basic applications.",
    features: ["Free certificate", "Self-paced", "Lifetime access", "Quizzes included"]
  },
  {
    id: "ds-simplilearn-1",
    title: "Post Graduate Program in Data Science",
    category: "datascience",
    provider: "Simplilearn",
    price: 54999,
    rating: 4.6,
    reviewsCount: 18400,
    duration: "11 months",
    level: "All Levels",
    link: "https://www.simplilearn.com",
    description: "Master Python, Machine Learning, Tableau, SQL in collaboration with Purdue University and IBM.",
    features: ["Purdue Certificate", "IBM masterclasses", "Capstone projects", "Co-op career services"]
  },

  // Design
  {
    id: "design-udemy-1",
    title: "Ultimate Photoshop Training: From Beginner to Pro",
    category: "design",
    provider: "Udemy",
    price: 1699,
    rating: 4.7,
    reviewsCount: 88400,
    duration: "15 hours",
    level: "All Levels",
    link: "https://www.udemy.com/courses/search/?q=designing%20courses",
    description: "Master Photoshop CC without previous knowledge. Learn photo editing, typography, and web UI layout creation.",
    features: ["Certificate of completion", "22 downloadable resources", "Lifetime access", "Mobile access"]
  },
  {
    id: "design-coursera-1",
    title: "Google UX Design Professional Certificate",
    category: "design",
    provider: "Coursera",
    price: 3299,
    rating: 4.8,
    reviewsCount: 78900,
    duration: "6 months (10 hrs/week)",
    level: "Beginner",
    link: "https://www.coursera.org/search?query=designing%20courses",
    description: "Learn the foundations of UX design, build wireframes and prototypes, and conduct research to test your designs.",
    features: ["Professional certificate", "Portfolio projects", "7 course series", "Job placement support"]
  },

  // Cyber Security
  {
    id: "cyber-udemy-1",
    title: "The Complete Cyber Security Course: Hackers Exposed!",
    category: "cybersecurity",
    provider: "Udemy",
    price: 1299,
    rating: 4.5,
    reviewsCount: 145000,
    duration: "12 hours",
    level: "Beginner",
    link: "https://www.udemy.com/courses/search/?q=cybersecurity&src=sac&kw=cybersecurity",
    description: "Volume 1: Become a cyber security specialist. Learn how to stop hackers, prevent tracking, and protect privacy.",
    features: ["Certificate of completion", "1 downloadable resource", "Lifetime access", "Mobile/TV access"]
  },
  {
    id: "cyber-coursera-1",
    title: "Google Cybersecurity Professional Certificate",
    category: "cybersecurity",
    provider: "Coursera",
    price: 4099,
    rating: 4.8,
    reviewsCount: 32000,
    duration: "6 months (7 hrs/week)",
    level: "Beginner",
    link: "https://www.coursera.org/search?query=cybersecurity",
    description: "Prepare for an entry-level job in cybersecurity. Learn Python, Linux, SQL, and SIEM tools.",
    features: ["Employer consortium access", "Ace interview prep", "8 course series", "Shareable certificate"]
  },
  {
    id: "cyber-gl-1",
    title: "Cyber Security Threats and Vulnerabilities",
    category: "cybersecurity",
    provider: "Great Learning",
    price: 0,
    rating: 4.6,
    reviewsCount: 9200,
    duration: "1.5 hours",
    level: "Beginner",
    link: "https://www.mygreatlearning.com/academy/search?keyword=cyber%20security",
    description: "Understand the various kinds of security threats, phishing, and software vulnerabilities.",
    features: ["Free certificate", "Self-paced", "Lifetime access", "Knowledge checks"]
  },
  {
    id: "cyber-simplilearn-1",
    title: "Cyber Security Expert Certificate Program",
    category: "cybersecurity",
    provider: "Simplilearn",
    price: 45000,
    rating: 4.5,
    reviewsCount: 6200,
    duration: "6 months",
    level: "Intermediate",
    link: "https://www.simplilearn.com",
    description: "Learn advanced cryptography, computer networks, risk management, and ethical hacking protocols.",
    features: ["Simplilearn Certification", "Hands-on labs", "CompTIA authorized partner", "24/7 learning assistance"]
  },

  // AI & Machine Learning
  {
    id: "ai-udemy-1",
    title: "Artificial Intelligence A-Z 2024: Build an AI",
    category: "aiml",
    provider: "Udemy",
    price: 1799,
    rating: 4.4,
    reviewsCount: 33400,
    duration: "16.5 hours",
    level: "Intermediate",
    link: "https://www.udemy.com/courses/search/?src=ukw&q=artificial+intelligence",
    description: "Combine Data Science, Machine Learning and Deep Learning to create powerful AI for Real-World applications.",
    features: ["Certificate of completion", "Code templates", "Lifetime access", "Q&A forum support"]
  },
  {
    id: "ai-coursera-1",
    title: "Supervised Machine Learning: Regression and Classification",
    category: "aiml",
    provider: "Coursera",
    price: 4099,
    rating: 4.9,
    reviewsCount: 182000,
    duration: "33 hours",
    level: "Beginner",
    link: "https://www.coursera.org/search?query=machine%20learning",
    description: "Created by AI pioneer Andrew Ng. Build machine learning models in Python using NumPy and Scikit-learn.",
    features: ["Taught by Andrew Ng", "Flexible deadlines", "Hands-on coding labs", "Shareable certificate"]
  },
  {
    id: "ai-gl-1",
    title: "Introduction to Artificial Intelligence",
    category: "aiml",
    provider: "Great Learning",
    price: 0,
    rating: 4.5,
    reviewsCount: 44200,
    duration: "1.5 hours",
    level: "Beginner",
    link: "https://www.mygreatlearning.com/academy/search?keyword=artificial%20intelligence",
    description: "Learn the core definitions of AI, history, subsets like ML & DL, and modern application areas.",
    features: ["Free certificate", "Self-paced", "Lifetime access", "Video lessons"]
  },
  {
    id: "aiml-pwskills-1",
    title: "Practical Machine Learning & Deep Learning",
    category: "aiml",
    provider: "PW Skills",
    price: 5999,
    rating: 4.8,
    reviewsCount: 8900,
    duration: "6 months",
    level: "Beginner",
    link: "https://pwskills.com/courses",
    description: "Get a comprehensive introduction to machine learning algorithms, Neural Networks, PyTorch, and TensorFlow.",
    features: ["PW Skills Certificate", "1-on-1 mentorship", "Resume building", "Live coding labs"]
  },

  // Marketing
  {
    id: "mkt-udemy-1",
    title: "The Complete Digital Marketing Course - 12 Courses in 1",
    category: "marketing",
    provider: "Udemy",
    price: 1899,
    rating: 4.5,
    reviewsCount: 162000,
    duration: "22.5 hours",
    level: "All Levels",
    link: "https://www.udemy.com/courses/search/?q=digital+marketing&src=sac&kw=digital",
    description: "Master SEO, Facebook Marketing, YouTube Marketing, Google Adwords, Google Analytics, and more!",
    features: ["Certificate of completion", "36 articles", "10 downloadable resources", "Step-by-step guides"]
  },
  {
    id: "mkt-coursera-1",
    title: "Google Digital Marketing & E-commerce Certificate",
    category: "marketing",
    provider: "Coursera",
    price: 3299,
    rating: 4.8,
    reviewsCount: 22500,
    duration: "6 months (6 hrs/week)",
    level: "Beginner",
    link: "https://www.coursera.org/search?query=digital%20marketing",
    description: "Learn the fundamentals of digital marketing and e-commerce, manage social media campaigns, and measure results.",
    features: ["Professional certificate", "CV & interview assistance", "Portfolio templates", "Employer portal access"]
  },

  // Cloud Computing & DevOps
  {
    id: "cloud-udemy-1",
    title: "Ultimate AWS Certified Solutions Architect Associate",
    category: "cloudcomputing",
    provider: "Udemy",
    price: 1699,
    rating: 4.7,
    reviewsCount: 198000,
    duration: "27 hours",
    level: "Intermediate",
    link: "https://www.udemy.com/courses/search/?q=aws+certified",
    description: "Pass the AWS Certified Solutions Architect Associate Certification. Learn all AWS fundamentals in detail.",
    features: ["Certificate of completion", "Practice exams", "Lifetime access", "Active student forum"]
  },
  {
    id: "cloud-coursera-1",
    title: "Google Cloud Digital Leader Training Professional Certificate",
    category: "cloudcomputing",
    provider: "Coursera",
    price: 3299,
    rating: 4.8,
    reviewsCount: 15400,
    duration: "16 hours",
    level: "Beginner",
    link: "https://www.coursera.org/search?query=google%20cloud",
    description: "Learn Google Cloud basics, core services, security protocols, and how to operate cloud architectures.",
    features: ["Professional certificate", "Flexible deadlines", "100% online courses", "Hands-on cloud console labs"]
  },
  {
    id: "cloud-gl-1",
    title: "Cloud Computing Foundations",
    category: "cloudcomputing",
    provider: "Great Learning",
    price: 0,
    rating: 4.5,
    reviewsCount: 28500,
    duration: "2.5 hours",
    level: "Beginner",
    link: "https://www.mygreatlearning.com/academy/search?keyword=cloud%20computing",
    description: "Get introduced to cloud structures: SaaS, PaaS, IaaS, AWS architecture, and virtual servers.",
    features: ["Free certificate", "Self-paced", "Lifetime access", "Quiz assessment"]
  },
  {
    id: "blockchain-pwskills-1",
    title: "Smart Contract & DApp Development with Solidity",
    category: "cloudcomputing",
    provider: "PW Skills",
    price: 3499,
    rating: 4.6,
    reviewsCount: 3800,
    duration: "4 months",
    level: "Intermediate",
    link: "https://pwskills.com/courses",
    description: "Learn Ethereum programming, smart contract validation, Solidity compilation, and Web3 integration.",
    features: ["Certificate of completion", "Doubt support", "Project portfolio", "Placement help"]
  },

  // Project Management & Business
  {
    id: "pm-udemy-1",
    title: "PMP Exam Prep Seminar - Complete Exam Coverage",
    category: "business",
    provider: "Udemy",
    price: 1899,
    rating: 4.6,
    reviewsCount: 94000,
    duration: "35 hours",
    level: "Intermediate",
    link: "https://www.udemy.com/courses/search/?q=pmp+exam",
    description: "Earn 35 contact hours for the PMP exam. Complete coverage of PMBOK Guide 7th Edition concepts.",
    features: ["35 Contact Hours Certificate", "2 practice exams", "Lifetime access", "PMP application advice"]
  },
  {
    id: "pm-coursera-1",
    title: "Google Project Management Professional Certificate",
    category: "business",
    provider: "Coursera",
    price: 3299,
    rating: 4.8,
    reviewsCount: 61000,
    duration: "6 months (10 hrs/week)",
    level: "Beginner",
    link: "https://www.coursera.org/search?query=project%20management",
    description: "Prepare for a new career in project management. Learn agile systems, scrum, project documentation, and tools.",
    features: ["Professional certificate", "Resume builder access", "6 course series", "Ace interview preparation"]
  },

  // Swayam
  {
    id: "swayam-dsa-1",
    title: "Data Structures and Algorithms using Java",
    category: "programming",
    provider: "Swayam",
    price: 0,
    rating: 4.5,
    reviewsCount: 14200,
    duration: "12 weeks",
    level: "Intermediate",
    link: "https://swayam.gov.in",
    description: "Learn key data structures and algorithms in Java, designed by top IIT professors. Completely free with optional exam certificate.",
    features: ["Free access", "IIT credit-based syllabus", "Weekly assignments", "Optional exam certificate"]
  },
  {
    id: "swayam-ai-1",
    title: "Introduction to Artificial Intelligence",
    category: "aiml",
    provider: "Swayam",
    price: 0,
    rating: 4.4,
    reviewsCount: 11200,
    duration: "8 weeks",
    level: "Beginner",
    link: "https://swayam.gov.in",
    description: "Core foundations of artificial intelligence, search algorithms, state space search, and neural networks designed by IISc.",
    features: ["Free access", "IISc syllabus", "Video lectures", "Doubt forum"]
  },
  // Scrimba Programming
  {
    id: "prog-scrimba-1",
    title: "The Frontend Developer Career Path",
    category: "programming",
    provider: "Scrimba",
    price: 7999,
    rating: 4.9,
    reviewsCount: 8500,
    duration: "75 hours",
    level: "Beginner",
    link: "https://scrimba.com/learn/frontend",
    description: "Become a job-ready frontend developer. Learn HTML, CSS, JavaScript, React, and build dozens of interactive projects in a unique hands-on editor.",
    features: ["Shareable certificate", "Interactive code editor", "Community discord access", "Code reviews"]
  },
  // Advanced Programming
  {
    id: "prog-udemy-2",
    title: "JavaScript: The Advanced Concepts (2026)",
    category: "programming",
    provider: "Udemy",
    price: 1999,
    rating: 4.8,
    reviewsCount: 35600,
    duration: "25 hours",
    level: "Advanced",
    link: "https://www.udemy.com/courses/search/?q=javascript",
    description: "Learn modern advanced JavaScript practices and be in the top 10% of JavaScript developers. Master closures, prototypes, async, and OOP.",
    features: ["Certificate of completion", "Full lifetime access", "Access on mobile and TV", "24 articles"]
  },
  // DataCamp Data Science
  {
    id: "ds-datacamp-1",
    title: "Data Scientist with Python",
    category: "datascience",
    provider: "DataCamp",
    price: 9500,
    rating: 4.7,
    reviewsCount: 24200,
    duration: "88 hours",
    level: "Intermediate",
    link: "https://www.datacamp.com/tracks/data-scientist-with-python",
    description: "Gain the career-ready skills you need to start your journey as a data scientist. Learn to import, clean, manipulate, and analyze data.",
    features: ["DataCamp certification", "Interactive in-browser coding", "20+ course path", "Real-world projects"]
  },
  // Coursera Data Science
  {
    id: "ds-coursera-2",
    title: "Applied Data Science with Python Specialization",
    category: "datascience",
    provider: "Coursera",
    price: 3299,
    rating: 4.6,
    reviewsCount: 41000,
    duration: "5 months (10 hrs/week)",
    level: "Intermediate",
    link: "https://www.coursera.org/specializations/data-science-python",
    description: "Gain skills in data visualization, machine learning, text analysis, and social network analysis through popular python toolkits.",
    features: ["Shareable specialization certificate", "Taught by UMich faculty", "Hands-on programming assignments", "Flexible schedule"]
  },
  // IxDF UX Design
  {
    id: "design-interactive-1",
    title: "User Experience: The Ultimate Guide to UX/UI",
    category: "design",
    provider: "Interaction Design Foundation",
    price: 11200,
    rating: 4.8,
    reviewsCount: 15400,
    duration: "28 hours",
    level: "Beginner",
    link: "https://www.interaction-design.org/courses",
    description: "Get a comprehensive introduction to user experience design. Learn design thinking, user research, wireframing, and visual design.",
    features: ["IxDF Industry certificate", "Portfolio builder", "Taught by industry experts", "Lifetime course access"]
  },
  // Hack Design (Free Design)
  {
    id: "design-hackdesign-1",
    title: "Design Lesson Path for Developers",
    category: "design",
    provider: "Hack Design",
    price: 0,
    rating: 4.5,
    reviewsCount: 52000,
    duration: "50 weeks (self-paced)",
    level: "Beginner",
    link: "https://hackdesign.org/",
    description: "An easy-to-follow design course for programmers and builders. Receive curations of top design articles, videos, and tutorials weekly.",
    features: ["Free registration", "Curated reading lists", "Weekly lessons by design masters", "Interactive challenges"]
  },
  // INE Cybersecurity
  {
    id: "cyber-ine-1",
    title: "eLearnSecurity Certified Penetration Tester (eCPPTv2)",
    category: "cybersecurity",
    provider: "INE",
    price: 24900,
    rating: 4.7,
    reviewsCount: 5400,
    duration: "45 hours",
    level: "Advanced",
    link: "https://ine.com/learning-paths/ecpptv2",
    description: "Master professional network penetration testing. Perform buffer overflows, advanced system exploitation, and professional reporting.",
    features: ["eCPPTv2 Certification exam voucher", "Interactive lab environments", "Full coverage of system exploits", "Access on mobile and desktop"]
  },
  // TryHackMe Cybersecurity
  {
    id: "cyber-tryhackme-1",
    title: "Pre-Security Pathway",
    category: "cybersecurity",
    provider: "TryHackMe",
    price: 1200,
    rating: 4.8,
    reviewsCount: 88200,
    duration: "40 hours",
    level: "Beginner",
    link: "https://tryhackme.com/path/outline/presecurity",
    description: "Learn the foundational cybersecurity concepts: networking, operating systems, and web technologies required to start a security career.",
    features: ["TryHackMe badge & certificate", "Hands-on gamified rooms", "Interactive Linux/Windows targets", "Self-paced study"]
  },
  // fast.ai AI & ML
  {
    id: "ai-fastai-1",
    title: "Practical Deep Learning for Coders",
    category: "aiml",
    provider: "fast.ai",
    price: 0,
    rating: 4.9,
    reviewsCount: 154000,
    duration: "25 hours",
    level: "Intermediate",
    link: "https://course.fast.ai/",
    description: "A free deep learning course for programmers. Learn how to build state-of-the-art computer vision, NLP, and tabular models using fastai and PyTorch.",
    features: ["Free online book & videos", "PyTorch based training", "Active student forum", "Colab / Kaggle integration"]
  },
  // Coursera AI & ML
  {
    id: "ai-coursera-2",
    title: "Deep Learning Specialization",
    category: "aiml",
    provider: "Coursera",
    price: 4099,
    rating: 4.9,
    reviewsCount: 168000,
    duration: "5 months (10 hrs/week)",
    level: "Advanced",
    link: "https://www.coursera.org/specializations/deep-learning",
    description: "Master deep learning foundations from Andrew Ng. Build and train neural networks, CNNs, RNNs, Transformers, and apply them in projects.",
    features: ["Taught by Andrew Ng", "Shareable specialization certificate", "Python programming assignments", "Access to career resources"]
  },
  // HubSpot Digital Marketing
  {
    id: "mkt-hubspot-1",
    title: "Inbound Marketing Certification Course",
    category: "marketing",
    provider: "HubSpot Academy",
    price: 0,
    rating: 4.7,
    reviewsCount: 42300,
    duration: "5 hours",
    level: "Beginner",
    link: "https://academy.hubspot.com/courses/inbound-marketing",
    description: "Learn inbound marketing strategies, content creation, social promotion, conversational growth, and lead nurturing.",
    features: ["Free industry certificate", "15 video lessons", "4 quizzes", "Downloadable templates"]
  },
  // Udemy Digital Marketing
  {
    id: "mkt-udemy-2",
    title: "Social Media Marketing Agency (SMMA) Course",
    category: "marketing",
    provider: "Udemy",
    price: 1699,
    rating: 4.6,
    reviewsCount: 18200,
    duration: "18.5 hours",
    level: "All Levels",
    link: "https://www.udemy.com/courses/search/?q=smma",
    description: "Learn how to build a social media marketing agency from scratch. Find clients, run Facebook ads, and scale operations.",
    features: ["Certificate of completion", "32 downloadable templates", "Lifetime access", "Client contract templates"]
  },
  // KodeKloud Cloud & DevOps
  {
    id: "cloud-kodekloud-1",
    title: "Certified Kubernetes Administrator (CKA)",
    category: "cloudcomputing",
    provider: "KodeKloud",
    price: 4500,
    rating: 4.8,
    reviewsCount: 19400,
    duration: "32 hours",
    level: "Intermediate",
    link: "https://kodekloud.com/courses/certified-kubernetes-administrator-cka/",
    description: "Prepare for the official CNCF CKA exam. Learn Kubernetes architecture, scheduling, service networking, and troubleshooting.",
    features: ["Shareable certificate", "In-browser Kubernetes labs", "Mock exams included", "Doubt support forum"]
  },
  // Udemy Cloud & DevOps
  {
    id: "cloud-udemy-2",
    title: "Docker & Kubernetes: The Practical Guide",
    category: "cloudcomputing",
    provider: "Udemy",
    price: 1499,
    rating: 4.7,
    reviewsCount: 65100,
    duration: "23 hours",
    level: "Beginner",
    link: "https://www.udemy.com/courses/search/?q=docker+kubernetes",
    description: "Learn Docker, Kubernetes, Compose, Swarm and Registry. Build and deploy containerized apps locally and on AWS/GCP.",
    features: ["Certificate of completion", "54 downloadable resources", "Lifetime access", "Full code repository access"]
  },
  // Coursera Project Management
  {
    id: "pm-coursera-2",
    title: "Scrum Master Certification Specialization",
    category: "business",
    provider: "Coursera",
    price: 3299,
    rating: 4.7,
    reviewsCount: 8800,
    duration: "3 months (10 hrs/week)",
    level: "Beginner",
    link: "https://www.coursera.org/specializations/scrum-master",
    description: "Build a strong foundation in Scrum frameworks. Learn to lead agile teams, remove blocker backlogs, and run effective sprint rituals.",
    features: ["Professional specialization certificate", "Agile workspace simulation", "Prep for PSM I exam", "Flexible schedule"]
  },
  // PMI Project Management
  {
    id: "pm-pmi-1",
    title: "Certified Associate in Project Management (CAPM) Prep",
    category: "business",
    provider: "Project Management Institute (PMI)",
    price: 18500,
    rating: 4.5,
    reviewsCount: 12500,
    duration: "23 hours",
    level: "Beginner",
    link: "https://www.pmi.org/certifications/certified-associate-capm",
    description: "Prepare for the CAPM exam. Master foundational project management terminology, agile concepts, and business analysis framework.",
    features: ["Official PMI CAPM prep hours", "Practice questions", "PMBOK guide exercises", "Shareable badge"]
  }
];

export const SEED_JOBS = [
  {
    id: "job-da",
    title: "Data Analyst",
    description: "Data Analysts collect, process, and perform statistical analyses of data to identify trends, create visualizations, and provide actionable insights that drive business decisions.",
    salary: "₹5,50,000 - ₹9,50,000 / year (5.5 - 9.5 LPA)",
    skills: ["SQL", "Python or R", "Tableau / PowerBI", "Excel", "Data Visualization", "Statistics"],
    link: "https://in.linkedin.com/jobs/data-analyst-jobs?position=1&pageNum=0"
  },
  {
    id: "job-sd",
    title: "Software Developer",
    description: "Software Developers design, program, test, and maintain applications and operating systems. They work with product teams to build scalable code that solves user needs.",
    salary: "₹7,50,000 - ₹14,00,000 / year (7.5 - 14 LPA)",
    skills: ["JavaScript/TypeScript", "Python or Java", "Git", "Data Structures", "Algorithms", "Testing"],
    link: "https://in.linkedin.com/jobs/software-engineer-jobs?position=1&pageNum=0"
  },
  {
    id: "job-fs",
    title: "Fullstack Developer",
    description: "Fullstack Developers manage both front-end (user interface) and back-end (database, API, server logic) engineering, providing complete end-to-end solutions for web products.",
    salary: "₹8,50,000 - ₹16,00,000 / year (8.5 - 16 LPA)",
    skills: ["React / Vue / Angular", "Node.js or Python", "SQL & NoSQL Databases", "REST / GraphQL", "Git & CI/CD", "AWS/Cloud Systems"],
    link: "https://in.linkedin.com/jobs/full-stack-developer-jobs?position=1&pageNum=0"
  },
  {
    id: "job-cs",
    title: "Cyber Security Specialist",
    description: "Cybersecurity Specialists protect organizations from digital attacks. They design security systems, run vulnerability assessments, monitor network traffic, and handle threat mitigations.",
    salary: "₹8,00,000 - ₹15,00,000 / year (8 - 15 LPA)",
    skills: ["Network Security", "Linux Systems", "Python scripting", "Ethical Hacking", "Cryptography", "SIEM Tools"],
    link: "https://in.linkedin.com/jobs/cyber-security-jobs?position=1&pageNum=0"
  },
  {
    id: "job-bd",
    title: "Blockchain Developer",
    description: "Blockchain Developers design and build decentralized architectures, protocols, smart contracts, and decentralized applications (DApps) for finance, supply chains, and security sectors.",
    salary: "₹9,50,000 - ₹18,00,000 / year (9.5 - 18 LPA)",
    skills: ["Solidity / Rust", "Cryptography", "Ethereum / Web3.js", "Smart Contracts", "Data Structures", "Node.js"],
    link: "https://in.linkedin.com/jobs/blockchain-developer-jobs?position=1&pageNum=0"
  },
  {
    id: "job-dm",
    title: "Digital Marketer",
    description: "Digital Marketers utilize digital channels (search engines, social media, email, websites) to reach target audiences, drive brand awareness, acquire customers, and analyze performance campaigns.",
    salary: "₹4,50,000 - ₹8,00,000 / year (4.5 - 8 LPA)",
    skills: ["SEO & SEM", "Google Analytics", "Social Media Ads", "Content Strategy", "Email Campaigns", "Copywriting"],
    link: "https://in.linkedin.com/jobs/digital-marketing-jobs?position=1&pageNum=0"
  }
];
