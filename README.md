# VeritasGrades: Examination Grading and Query System

A centralized, secure portal for faculty and administrators to manage student records, process examination scores, and query academic data at Veritas University, Bwari. This project serves as a Final Year Project for the Design and Implementation of a Database Scheme and Query System for Students Examination Grading and Processing.

## Project Overview

VeritasGrades digitizes the entire examination lifecycle, moving away from manual, error-prone paper processing. It offers robust role-based access, a beautifully designed monochromatic interface, and secure data handling mechanisms.

## Core Features Implemented

1. **Landing Page and Global Navigation**
   - A premium, responsive black-and-white theme using TailwindCSS.
   - Smooth anchor scrolling to key sections: Features, Workflow, Schema Details, and Security Architecture.
   - Animated grid texture background for a dynamic aesthetic.
   - A streamlined, focused layout removing unnecessary bloat.

2. **Unified Authentication System**
   - Fully mocked frontend authentication powered by React Context API and LocalStorage.
   - Secure login mechanisms with built-in role detection.
   - "Sign Up" flow that restricts all new account creations strictly to the "Student" role and features dynamic, custom course selection using an interactive tag-based input.
   - Hardcoded Admin bypass for faculty testing: Email (`Admin@gmail.com`) and Password (`Admin123`).

3. **Role-Based Dashboards**
   - **Faculty Dashboard**: A protected route displaying top-level university metrics (Total Students, Grades Processed) and an interactive mock table of recent grade submissions. Features a fully-wired "Upload Batch Grades" button that accepts CSV/XLSX files.
   - **Student Dashboard**: A protected route generating a custom Academic Snapshot based on the student's dynamic course selection during registration. Displays calculated CGPA and mocked grades.

4. **Database Schema Documentation**
   - A dedicated documentation section detailing the Third Normal Form (3NF) relational structures for Students, Courses, Grades, and Audit Logs.

## Current Work in Progress (WIP)

We are actively polishing the frontend to premium standards before migrating to a fully real-time backend architecture. Current developments include:
- **Custom Toast Notifications**: Replacing standard browser alerts with sleek, animated, non-blocking toast notifications for actions like logging in and uploading grades.
- **Transcript Exporting**: Implementing native PDF export functionality allowing students to download a stylized, print-ready Result Slip directly from their dashboard.
- **Empty States**: Designing beautiful, engaging empty states for dashboards when no courses are registered or no submissions exist.
- **Confirmation Modals**: Adding robust verification dialogs for critical faculty actions like approving grades.

## Future Road Map: Real-Time Backend Transition
- **WebSocket/SSE Integration**: Upgrading mocked states to live, instant updates across all active dashboards.
- **PostgreSQL & Multer**: Replacing the mock CSV upload with actual server-side `.csv` parsing, curve calculation, and bulk database inserts.
- **JWT Cryptography**: Upgrading the mock LocalStorage context to stateless, HTTP-only secure cookies with Bcrypt password hashing.

## Getting Started

First, install the necessary dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

**To test the Faculty Dashboard**, log in using:
Email: `Admin@gmail.com`
Password: `Admin123`

**To test the Student Dashboard**, click "Create Account" on the home page and register a test user.
