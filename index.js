const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
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
app.use(express.json());

// Create tables if they don't already exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS questionnaire_questionnaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS questionnaire_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_text TEXT NOT NULL,
      type TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS questionnaire_junction (
      questionnaire_id INTEGER,
      question_id INTEGER,
      priority INTEGER,
      PRIMARY KEY (questionnaire_id, question_id),
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaire_questionnaires(id),
      FOREIGN KEY (question_id) REFERENCES questionnaire_questions(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS questionnaire_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      questionnaire_id INTEGER,
      question_id INTEGER,
      answer TEXT NOT NULL,
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaire_questionnaires(id),
      FOREIGN KEY (question_id) REFERENCES questionnaire_questions(id)
    )
  `);
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
