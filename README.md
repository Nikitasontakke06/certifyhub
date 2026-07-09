# CertifyHub 🚀

CertifyHub is a professional certifications comparison platform and offline class discovery engine. Designed with a sleek glassmorphic aesthetics theme, it enables users to search, evaluate, and compare online certifications alongside local offline coaching institutes to accelerate their learning journeys.

---

## ⭐️ Core Features

### 1. Online Courses Engine
- **Intelligent Discovery**: Search and filter through thousands of online certification courses by platform, domains, fees, and ratings.
- **Side-by-Side Matrix**: Compare up to three online courses on curricula, certification bodies, and career support metrics.
- **Dynamic Trend Indicators**: Track popular and emerging domain trends in real-time.

### 2. Job Trends Insights
- Analyze real-world job demand metrics, average industry salaries, and hiring volume projections based on specific certification types.

### 3. Chatbot Companion
- A persistent chatbot widget offering recommendations and answering questions about certification eligibility, career paths, and local academies.

### 4. 📍 Offline Classes & Coaching Module
Allows users to discover and schedule classroom training near them:
- **Nested Category Navigation**: Quick hover sub-menu redirects to Online vs. Offline domains.
- **Geolocated SVG Map Discovery**: Interactive map highlighting nearby academies in major tech hubs (Bengaluru, Pune, Gurugram).
- **Comprehensive Academy Profiles**: Dedicated detail screens detailing established years, infrastructure facilities, syllabi, contact phone lines, and direct WhatsApp chat links.
- **Inquiry Booking Schedule**: Schedule free demo sessions, request call-backs, or schedule campus visits directly from the course roster.
- **Student Reviews Panel**: Verified student feedback with rating breakdown bars, pros/cons tags, and review helpfulness likes.
- **Admin Workspace Console**: Form-based dashboard to manage institutes (register new physical academies, add courses) and track student inquiries.
- **Login Tracking Log**: Automatically saves metadata of successful logins and signup registrations (user email, timestamps, client IP address, and browser User-Agent) inside MongoDB.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite environment), Vanilla CSS (Glassmorphism & animations), Lucide React (vector icons), React Router DOM.
- **Backend**: Node.js & Express REST API server.
- **Database**: MongoDB & Mongoose schemas.
- **Scheduler**: Automatic cron scheduler for periodically recalculating market metrics.

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas connection string.

### Setup Instructions

1. **Clone the Repository & Checkout Branch**:
   ```bash
   git clone https://github.com/Nikitasontakke06/certifyhub.git
   cd certifyhub
   git checkout nikita
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/certifyhub
   ```

3. **Install Dependencies**:
   - **Backend**:
     ```bash
     cd backend
     npm install
     ```
   - **Frontend**:
     ```bash
     cd ../frontend
     npm install
     ```

4. **Run the Application**:
   - **Start Backend API Server** (this will automatically seed initial courses, jobs, and coaching institutes):
     ```bash
     cd backend
     npm start
     ```
   - **Start Frontend Client Dev Server**:
     ```bash
     cd frontend
     npm run dev
     ```
     Access the application at `http://localhost:5173`.