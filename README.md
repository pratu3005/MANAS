# Manas - Local Setup & SQL Backend Guide

Welcome to the Manas local setup guide. This document explains how to move from this preview to a professional development environment.

## 🚀 Local Installation

1. **Clone/Download** your files into a new folder.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🗄️ SQL Backend Setup

To replace the `localStorage` with a real SQL database:

### 1. Database Schema (`schema.sql`)
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    theme TEXT DEFAULT 'light'
);

CREATE TABLE mood_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    timestamp INTEGER,
    mood TEXT,
    stress_level INTEGER,
    note TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### 2. Sample Express Backend (`server.js`)
You can find the implementation example in the `backend-setup.js` file provided in this project root.

### 3. Connecting Frontend to Backend
In `App.tsx`, change your data fetching logic:
```typescript
// From this:
const saved = localStorage.getItem('manas_moods');

// To this:
const response = await fetch('/api/moods', {
    headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
```

## 🌐 Deployment
To get a public link for your website:
1. Push your code to **GitHub**.
2. Connect your repository to **Vercel** or **Netlify**.
3. Add your `API_KEY` to the provider's Environment Variables section.
4. Your site will be live at `https://your-app-name.vercel.app`.
