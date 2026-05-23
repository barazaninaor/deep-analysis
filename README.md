# Deep Analysis - Financial Insights

The professional standard for fundamental stock research. This application transforms complex financial statements into actionable investment insights through responsive charts and interactive trend analysis.

---

## Architecture & Development Phases

This project was designed and built with a scalable full-stack mindset:

- **Phase 1 (Full Stack Architecture):** Developed a complete secure authentication system using **Node.js**, **Express**, and **SQL Server** (including custom login, registration, password hashing, and user profile management functionality).
- **Phase 2 (Production Optimization & frictionless Access):** Transitioned the live site into a standalone, high-performance client-facing application. This decoupling allows immediate, frictionless public code review and demo access for reviewers and recruiters without requiring local database or server setups.

---

## 💻 Tech Stack

- **Frontend:** React, TypeScript, React Router v6
- **Styling & UI:** Custom CSS3 (featuring modern high-contrast neon/space aesthetics), Flexbox, Grid
- **Data Visualization:** Recharts (Responsive financial trend graphs)

---

# Project Setup & Migration Guide

## Activation on another computer

1. **Delete** `node_modules` folders in both the **root** directory and the **server** directory.
2. On the new computer, run `npm install` in the **root** directory.
3. Run `npm install` inside the **server** directory.

## Running the project

\*   **Server:** Inside the `server` folder, run: 1. npm install
    2. node --watch app.js

\*   **Frontend:** Inside the **root** folder, run:
    npm run dev

\*\* Enter the DB
