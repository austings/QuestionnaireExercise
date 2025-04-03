const sqlite3 = require('sqlite3').verbose();

// Create or open the database (it will create the file if it doesn't exist)
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});
// Function to insert data from CSV into the database
function loadCSVData() {
  // Load data into questionnaire_questionnaires
  fs.createReadStream('questionnaire_questionnaires.csv')
    .pipe(csv())
    .on('data', (row) => {
      const { name, description } = row;
      db.run(`
        INSERT INTO questionnaire_questionnaires (name, description) VALUES (?, ?)
      `, [name, description], (err) => {
        if (err) {
          console.error('Error inserting data into questionnaire_questionnaires:', err);
        }
      });
    })
    .on('end', () => {
      console.log('CSV data loaded into questionnaire_questionnaires table');
    });

  // Load data into questionnaire_questions
  fs.createReadStream('questionnaire_questions.csv')
    .pipe(csv())
    .on('data', (row) => {
      const { question_text, type } = row;
      db.run(`
        INSERT INTO questionnaire_questions (question_text, type) VALUES (?, ?)
      `, [question_text, type], (err) => {
        if (err) {
          console.error('Error inserting data into questionnaire_questions:', err);
        }
      });
    })
    .on('end', () => {
      console.log('CSV data loaded into questionnaire_questions table');
    });

  // Load data into questionnaire_junction (assuming this CSV has questionnaire_id, question_id, and priority)
  fs.createReadStream('questionnaire_junction.csv')
    .pipe(csv())
    .on('data', (row) => {
      const { questionnaire_id, question_id, priority } = row;
      db.run(`
        INSERT INTO questionnaire_junction (id, questionnaire_id, question_id, priority) VALUES (?, ?, ?, ?)
      `, [questionnaire_id, question_id, priority], (err) => {
        if (err) {
          console.error('Error inserting data into questionnaire_junction:', err);
        }
      });
    })
    .on('end', () => {
      console.log('CSV data loaded into questionnaire_junction table');
    });

}


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
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   questionnaire_id INTEGER,
   question_id INTEGER,
   priority INTEGER,
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
