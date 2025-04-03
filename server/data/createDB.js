const sqlite3 = require('sqlite3').verbose();

// Create or open the database (it will create the file if it doesn't exist)
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create tables
db.serialize(() => {
  // Create questionnaire_questionnaires table
  db.run(`
    CREATE TABLE IF NOT EXISTS questionnaire_questionnaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    )
  `);

  // Create questionnaire_questions table
  db.run(`
    CREATE TABLE IF NOT EXISTS questionnaire_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_text TEXT NOT NULL,
      type TEXT NOT NULL
    )
  `);

  // Create questionnaire_junction table to map questionnaires to questions with priority
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

  // Create questionnaire_answers table to store user responses
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

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('Database created and tables initialized successfully!');
  }
});
