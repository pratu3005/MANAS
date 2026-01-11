
/**
 * MANAS BACKEND EXAMPLE
 * Run this using: node backend-setup.js
 * Requires: npm install express sqlite3 cors bcryptjs jsonwebtoken
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const db = new sqlite3.Database('./manas.db');

app.use(cors());
app.use(express.json());

// Initialize SQL Tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    theme TEXT DEFAULT 'light'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS mood_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    mood TEXT,
    stress_level INTEGER,
    note TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

// Auth Routes
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, hashedPassword], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, name, email });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, 'SECRET_KEY');
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, theme: user.theme } });
  });
});

// Mood Routes
app.get('/api/moods', (req, res) => {
  // In a real app, verify JWT here
  db.all(`SELECT * FROM mood_entries ORDER BY timestamp DESC`, (err, rows) => {
    res.json(rows);
  });
});

app.post('/api/moods', (req, res) => {
  const { user_id, mood, stress_level, note } = req.body;
  const sql = `INSERT INTO mood_entries (user_id, mood, stress_level, note) VALUES (?, ?, ?, ?)`;
  db.run(sql, [user_id, mood, stress_level, note], function(err) {
    res.json({ id: this.lastID });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
