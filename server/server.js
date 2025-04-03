
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
app.use("/data", express.static("data")); // Exposes CSV

const port = 3000;

// Set up SQLite database (it will be created as a file on disk)
const db = new sqlite3.Database('./data/mydatabase.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});


// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Route to serve the index.html file when the user visits the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Example route to get all questionnaires
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
    SELECT q.question_text, q.type, jq.priority 
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

// Example route to save answers
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
  console.log(`Server is running on http://localhost:${port}`);
});
