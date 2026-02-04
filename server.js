const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to SQLite Database file
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error("Database opening error:", err);
    else console.log("✅ Connected to SQLite database.");
});

// 2. Create Users Table (if it doesn't exist)
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
)`);

// 3. Register Route
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function(err) {
        if (err) {
            return res.status(400).json({ error: "Email already exists." });
        }
        res.status(201).json({ message: "User created!" });
    });
});

// 4. Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            res.json({ success: true, message: "Access Granted" });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});
if (response.ok) {
    if (isLoginMode) {
        // This is the line that opens your project!
        // Replace 'my_tools.html' with the actual name of your file.
        window.location.href = 'Untitled-2.html'; 
    } else {
        showMsg("Account created! Please sign in.", "text-green-500");
        authToggle.click();
    }
}

app.listen(3000, () => console.log("🚀 SQLite Server running on http://localhost:3000"));
