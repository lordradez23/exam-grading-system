# VeritasGrades: Examination Grading and Query System

A centralized, secure portal for faculty and administrators to manage student records, process examination scores, and query academic data at Veritas University, Bwari. This project serves as a Final Year Project for the Design and Implementation of a Database Scheme and Query System for Students Examination Grading and Processing.

## Project Overview

VeritasGrades digitizes the entire examination lifecycle, moving away from manual, error-prone paper processing. It offers robust role-based access, a beautifully designed monochromatic interface, and secure data handling mechanisms.

## Core Features Implemented

1. Landing Page and Global Navigation
   - A premium, responsive black-and-white theme using TailwindCSS.
   - Smooth anchor scrolling to key sections: Features, Workflow, Schema Details, and Security Architecture.
   - Animated grid texture background for a dynamic aesthetic.
   - A comprehensive multi-column global footer.

2. Unified Authentication System
   - Fully mocked frontend authentication powered by React Context API and LocalStorage.
   - Secure login mechanisms with built-in role detection.
   - "Sign Up" flow that restricts all new account creations strictly to the "Student" role to prevent unauthorized faculty access.
   - Hardcoded Admin bypass for faculty testing: Email (Admin@gmail.com) and Password (Admin123).

3. Role-Based Dashboards
   - Faculty Dashboard: A protected route displaying top-level university metrics (Total Students, Grades Processed) and an interactive mock table of recent grade submissions with approval workflows.
   - Student Dashboard: A protected route generating a custom Matriculation Number based on user ID, and displaying a full academic transcript with calculated GPA, Total Units, and mocked course data.

4. Database Schema Documentation
   - A dedicated documentation page detailing the Third Normal Form (3NF) relational structures for Students, Courses, Grades, and Audit Logs.

## Technology Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: TailwindCSS (Custom variables for monochromatic theme)
- State Management: React Context API
- Storage: Browser LocalStorage (for frontend mocking)

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

To test the Faculty Dashboard, log in using:
Email: Admin@gmail.com
Password: Admin123

To test the Student Dashboard, click "Create Account" on the home page and register a test user.
