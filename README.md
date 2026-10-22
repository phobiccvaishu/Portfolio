# Vaishnavi Singh — AI-Powered Developer Portfolio

> **"Building intelligent systems. Turning ideas into impact."**  
> Computer Science Engineering Student @ SRM Institute of Science and Technology.

---

## 🌟 Executive Overview

A high-performance personal portfolio and data-driven profile website engineered specifically for **Vaishnavi Singh**. Unlike generic templates populated with fictitious mockups, this platform is powered by a real data pipeline that ingests, validates, and presents verified technical work directly from official profile sources.

- **Primary Profile Sources**:
  - **GitHub**: [`https://github.com/phobiccvaishu`](https://github.com/phobiccvaishu) (Official REST API integration with real repository architectures)
  - **LinkedIn**: [`https://www.linkedin.com/in/vaishnavi-singh-076aba343`](https://www.linkedin.com/in/vaishnavi-singh-076aba343) (Dedicated PDF/data export import workflow)
- **Integrity Principle**: Strict source hierarchy (`Code Verified` > `Profile Listed` > `User Confirmed`). Zero fabricated metrics or synthetic credentials.

---

## 🎨 Visual Identity & Design System

- **Palette**: Near-black carbon canvas (`#090A0C`, `#101216`), warm white typography (`#F5F6F8`), and electric lime / chartreuse accent (`#D4FF00`).
- **Typography**: Editorial pairings of *Space Grotesk* (headings), *Plus Jakarta Sans* (human-readable body), and *JetBrains Mono* (code specifications & badges).
- **Motion & Accessibility**: Fluid micro-interactions via `framer-motion`, reduced-motion compliance (`prefers-reduced-motion`), visible focus rings, high contrast ratios, and semantic HTML5.

---

## 🚀 Verified Project Showcase

1. **Online Examination System with AI Proctoring**  
   - *Architecture*: Python FastAPI computer-vision microservice paired with a Node.js/Express core and MySQL database.
   - *Core Technologies*: YOLOv8s object detection (phone/unauthorized device detection), MediaPipe Face Landmarker (head-pose transformation matrices & gaze monitoring), MediaPipe Hand Landmarker, OpenCV, base64 frame streaming.
   - *Repository*: [github.com/phobiccvaishu/Online-Examination-System](https://github.com/phobiccvaishu/Online-Examination-System)

2. **Adaptive Study Twin (Personal Student Clone)**  
   - *Architecture*: React client with Framer Motion and Recharts talking to a Node.js/Express/MongoDB backend orchestrating OpenAI GPT-4o.
   - *Core Technologies*: Adaptive MCQ Quiz Engine modulating difficulty in real time, automated daily study plan generation, AI Chat Tutor.
   - *Repository*: [github.com/phobiccvaishu/Adaptive-Study-Twin](https://github.com/phobiccvaishu/Adaptive-Study-Twin)

3. **InsightU Academic Ecosystem & LMS**  
   - *Architecture*: NPM workspace monorepo utilizing React 18, TypeScript, TailwindCSS, TanStack Query, Node.js, Express, Prisma ORM, PostgreSQL, Redis, and Socket.io.
   - *Core Technologies*: Real-time academic health metrics (attendance, credits), AI OCR timetable mapping, live Smart Board lecture note sync.
   - *Repository*: [github.com/phobiccvaishu/InsightU](https://github.com/phobiccvaishu/InsightU)

4. **ChronoSearch**  
   - *Architecture*: Asynchronous FastAPI backend with Pandas vector querying.
   - *Core Technologies*: Multi-file CSV ingestion, temporal range filtering, sorting, pagination, and Jinja2 templating.
   - *Repository*: [github.com/phobiccvaishu/ChronoSearch](https://github.com/phobiccvaishu/ChronoSearch)

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, Multer (file uploads), PDF-Parse (LinkedIn/certificate parsing), TSX.
- **Data Validation**: Zod.
- **Testing**: Vitest, JSDOM.

---

## ⚡ Quick Start & Local Execution

### 1. Prerequisites
- Node.js (v18 or higher recommended; verified with v24)
- npm (v9 or higher)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server (Both Frontend & Backend Concurrently)
```bash
npm run dev
```
- **Frontend URL**: [http://localhost:5173](http://localhost:5173)
- **Backend API URL**: [http://localhost:5000](http://localhost:5000)

### 4. Run Unit Tests
```bash
npm run test
```

### 5. Build for Production
```bash
npm run build
```

---

## ⚙️ Profile Management & Live Import Pipeline

Click the **"Manage Data"** button in the header (or switch views) to access the interactive administrative dashboard:
- **GitHub Synchronizer**: Triggers a live sync against official GitHub REST API for `@phobiccvaishu`.
- **LinkedIn Profile Importer**: Upload a LinkedIn PDF (Profile > More > Save to PDF) or paste profile text. Features an interactive field review modal before publishing.
- **Certificate & Credential Manager**: Upload PDF/PNG/JPG certificates, categorize as Course/Certification/Internship/Award, provide official verification URLs, and preview files.
- **Live Contact Inquiries**: Validated contact form records messages securely in `server/data/messages.json`.

---

## 🌐 Deployment Guidelines

- **Frontend on Vercel**:
  1. Push repository to GitHub.
  2. Import repository in [Vercel](https://vercel.com).
  3. Framework Preset: `Vite`.
  4. Build Command: `npm run build`, Output Directory: `dist`.
- **Backend on Render / Railway**:
  1. Create a Web Service pointing to `server/index.ts`.
  2. Build Command: `npm install`, Start Command: `npx tsx server/index.ts`.
  3. Set Environment Variable: `PORT=5000`.
