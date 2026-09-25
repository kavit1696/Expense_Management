# Expense Manager Application (Full Stack)

A full-stack Expense Management system built with Node.js/Express backend and React + Vite frontend.

---

## 📁 Project Structure

```text
Expense_Manager_New/
├── expense-backend/              # Express API Server
│   ├── db/                       # Database connections (MySQL)
│   ├── models/                   # Data Models
│   ├── routes/                   # Express Routers
│   ├── services/                 # Business Logic & DB queries
│   ├── .env.example              # Environment variables template
│   ├── index.js                  # Entry point
│   └── package.json
└── expense-manager-frontend/     # React + Vite Client
    ├── src/
    │   ├── api/                  # Axios configuration
    │   ├── components/           # UI Components
    │   ├── pages/                # Application Views/Pages
    │   └── App.jsx
    ├── .env.example              # Environment variables template
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher
- **MySQL Database**: Server running locally or on cloud (e.g., Aiven, Supabase, Railway)

---

### 2. Backend Setup (`expense-backend`)

1. Navigate to the backend directory:
   ```bash
   cd expense-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=3001
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=expense_manager
   DB_SSL=false
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3001`.

---

### 3. Frontend Setup (`expense-manager-frontend`)

1. Navigate to the frontend directory:
   ```bash
   cd expense-manager-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## ☁️ Deployment Guide

### Deploying Backend (e.g. Render / Railway)
- **Root Directory**: `expense-backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Set Environment Variables on host platform (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `FRONTEND_URL`, etc.).

### Deploying Frontend (e.g. Vercel / Netlify)
- **Root Directory**: `expense-manager-frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- Set Environment Variable `VITE_API_BASE_URL` pointing to your deployed backend URL.
