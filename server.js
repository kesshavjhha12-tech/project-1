const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to DB
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error("Database opening error:", err);
    else console.log("✅ Connected to SQLite database.");
});

// Create table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
)`);

// Register
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        [email, hashedPassword],
        function (err) {
            if (err) {
                return res.status(400).json({ error: "Email already exists." });
            }
            res.status(201).json({ message: "User created!" });
        }
    );
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        async (err, user) => {

            if (err || !user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const isValid = await bcrypt.compare(password, user.password);

            if (isValid) {
                res.json({ success: true, message: "Access Granted" });
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        }
    );
});

// ✅ IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server running on port", PORT);
});
