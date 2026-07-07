export const COURSES_DATA = [
  // Programming
  {
    id: "prog-udemy-1",
    title: "The Complete Python Bootcamp From Zero to Hero in Python",
    category: "programming",
    provider: "Udemy",
    price: 18.99,
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
    price: 39.00, // subscription based
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
    price: 0, // Free
    rating: 4.5,
    reviewsCount: 15400,
    duration: "2 hours",
    level: "Beginner",
    link: "https://www.mygreatlearning.com/academy/search?keyword=programming%20courses",
    description: "Master Java basics including variables, data types, operators, and loops to build a solid foundation.",
    features: ["Free certificate", "Self-paced learning", "1.5 hours of video content", "Lifetime access"]
  },
  
  // Data Science
  {
    id: "ds-udemy-1",
    title: "Python for Data Science and Machine Learning Bootcamp",
    category: "datascience",
    provider: "Udemy",
    price: 24.99,
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
    price: 49.00,
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

  // Design
  {
    id: "design-udemy-1",
    title: "Ultimate Photoshop Training: From Beginner to Pro",
    category: "design",
    provider: "Udemy",
    price: 19.99,
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
    price: 39.00,
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
    price: 15.99,
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
    price: 49.00,
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

  // AI & Machine Learning
  {
    id: "ai-udemy-1",
    title: "Artificial Intelligence A-Z 2024: Build an AI",
    category: "aiml",
    provider: "Udemy",
    price: 21.99,
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
    price: 49.00,
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

  // Marketing
  {
    id: "mkt-udemy-1",
    title: "The Complete Digital Marketing Course - 12 Courses in 1",
    category: "marketing",
    provider: "Udemy",
    price: 22.99,
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
    price: 39.00,
    rating: 4.8,
    reviewsCount: 22500,
    duration: "6 months (6 hrs/week)",
    level: "Beginner",
    link: "https://www.coursera.org/search?query=digital%20marketing",
    description: "Learn the fundamentals of digital marketing and e-commerce, manage social media campaigns, and measure results.",
    features: ["Professional certificate", "CV & interview assistance", "Portfolio templates", "Employer portal access"]
  }
];

export const JOBS_DATA = [
  {
    id: "job-da",
    title: "Data Analyst",
    description: "Data Analysts collect, process, and perform statistical analyses of data to identify trends, create visualizations, and provide actionable insights that drive business decisions.",
    salary: "$68,000 - $98,000 / year",
    skills: ["SQL", "Python or R", "Tableau / PowerBI", "Excel", "Data Visualization", "Statistics"],
    linkedinSearchQuery: "data-analyst-jobs",
    link: "https://in.linkedin.com/jobs/data-analyst-jobs?position=1&pageNum=0"
  },
  {
    id: "job-sd",
    title: "Software Developer",
    description: "Software Developers design, program, test, and maintain applications and operating systems. They work with product teams to build scalable code that solves user needs.",
    salary: "$85,000 - $125,000 / year",
    skills: ["JavaScript/TypeScript", "Python or Java", "Git", "Data Structures", "Algorithms", "Testing"],
    link: "https://in.linkedin.com/jobs/software-engineer-jobs?position=1&pageNum=0"
  },
  {
    id: "job-fs",
    title: "Fullstack Developer",
    description: "Fullstack Developers manage both front-end (user interface) and back-end (database, API, server logic) engineering, providing complete end-to-end solutions for web products.",
    salary: "$90,000 - $135,000 / year",
    skills: ["React / Vue / Angular", "Node.js or Python", "SQL & NoSQL Databases", "REST / GraphQL", "Git & CI/CD", "AWS/Cloud Systems"],
    link: "https://in.linkedin.com/jobs/full-stack-developer-jobs?position=1&pageNum=0"
  },
  {
    id: "job-cs",
    title: "Cyber Security Specialist",
    description: "Cybersecurity Specialists protect organizations from digital attacks. They design security systems, run vulnerability assessments, monitor network traffic, and handle threat mitigations.",
    salary: "$95,000 - $140,000 / year",
    skills: ["Network Security", "Linux Systems", "Python scripting", "Ethical Hacking", "Cryptography", "SIEM Tools"],
    link: "https://in.linkedin.com/jobs/cyber-security-jobs?position=1&pageNum=0"
  },
  {
    id: "job-bd",
    title: "Blockchain Developer",
    description: "Blockchain Developers design and build decentralized architectures, protocols, smart contracts, and decentralized applications (DApps) for finance, supply chains, and security sectors.",
    salary: "$105,000 - $160,000 / year",
    skills: ["Solidity / Rust", "Cryptography", "Ethereum / Web3.js", "Smart Contracts", "Data Structures", "Node.js"],
    link: "https://in.linkedin.com/jobs/blockchain-developer-jobs?position=1&pageNum=0"
  },
  {
    id: "job-dm",
    title: "Digital Marketer",
    description: "Digital Marketers utilize digital channels (search engines, social media, email, websites) to reach target audiences, drive brand awareness, acquire customers, and analyze performance campaigns.",
    salary: "$55,000 - $82,000 / year",
    skills: ["SEO & SEM", "Google Analytics", "Social Media Ads", "Content Strategy", "Email Campaigns", "Copywriting"],
    link: "https://in.linkedin.com/jobs/digital-marketing-jobs?position=1&pageNum=0"
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Courses" },
  { id: "programming", name: "Programming" },
  { id: "datascience", name: "Data Science" },
  { id: "design", name: "UI/UX & Design" },
  { id: "cybersecurity", name: "Cyber Security" },
  { id: "aiml", name: "AI & Machine Learning" },
  { id: "marketing", name: "Digital Marketing" }
];
