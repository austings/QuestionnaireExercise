const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors'); // Import the CORS package

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000; // Backend port
const JWT_SECRET = '1234';

// Enable CORS for all origins (you can restrict this later)
app.use(cors());

// Set up SQLite database
const db = new sqlite3.Database('./data/mydatabase.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Middleware
app.use(express.json()); // To parse JSON requests
app.use("/data", express.static("data")); // Expose CSVs

// API Routes
// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }

  // Query the database to find the user
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Compare password (hashed) using bcrypt
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
      }

      if (!match) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }

      // Create a JWT token
      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ success: true, token });
    });
  });
});


app.get('/questionnaires', (req, res) => {
  db.all('SELECT * FROM questionnaire_questionnaires', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching questionnaires');
    }
    res.json(rows);
  });
});

// Example route to get questions for a specific questionnaire
app.get('/questionnaire/:id', (req, res) => {
  const { id } = req.params;
  db.all(`
    SELECT q.question
    FROM questionnaire_questions q
    JOIN questionnaire_junction jq ON q.id = jq.question_id
    WHERE jq.questionnaire_id = ?
    ORDER BY jq.priority
  `, [id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching questions');
    }
    res.json(rows);
  });
});

// Route to save answers
app.post('/submit-answers', (req, res) => {
  const { user_id, questionnaire_id, answers } = req.body;

  const stmt = db.prepare('INSERT INTO questionnaire_answers (user_id, questionnaire_id, question_id, answer) VALUES (?, ?, ?, ?)');

  answers.forEach(answer => {
    stmt.run(user_id, questionnaire_id, answer.question_id, answer.answer);
  });

  stmt.finalize(() => {
    res.status(200).send('Answers submitted successfully');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
