const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser'); 
const bcrypt = require('bcryptjs');

// Create or open the database (it will create the file if it doesn't exist)
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Function to insert users and close db
async function insertAdminAndClose() {
  //hardcode usernames
  const adminPassword = 'password';  // Replace with the actual admin password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);  // Hash the password
  const username = 'admin';
  const isAdmin = 1;  // Mark as admin

  const userPassword = 'pass';  // Replace with the actual user password
  const hashedUserPassword = await bcrypt.hash(userPassword, 10);  // Hash the password
  const userUsername = 'user';
  const userisAdmin = 0;  // Mark as user

  // Clear the users table
  db.run('DELETE FROM users', function(err) {
    if (err) {
      console.error('Error clearing users table:', err.message);
      return;
    }
    
    console.log('Users table cleared.');


    const sql = `INSERT INTO users (username, password, admin) VALUES (?, ?, ?)`;

    db.run(sql, [userUsername, hashedUserPassword, userisAdmin], function(err) {
      if (err) {
        console.error('Error inserting user:', err.message);
      } else {
        console.log('Average user inserted with ID:', this.lastID);
      }
    });


    db.run(sql, [username, hashedPassword, isAdmin], function(err) {
      if (err) {
        console.error('Error inserting admin:', err.message);
      } else {
        console.log('Admin user inserted with ID:', this.lastID);
      }
    }).on('end', () => {
      console.log('CSV data loaded into questionnaire_questionnaires table');
    
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database created and tables initialized successfully!');
        }
      });
    });

  });
}

// Function to insert data from CSV into the database
function loadCSVData() {
  // Clear the questionnaire_junction table before inserting new data
  db.run('DELETE FROM questionnaire_junction', (err) => {
    if (err) {
      console.error('Error clearing the questionnaire_junction table:', err);
    } else {
      console.log('questionnaire_junction table cleared, starting to load new data...');
      
      // Load data into questionnaire_junction
      fs.createReadStream('questionnaire_junction.csv')
        .pipe(csv())
        .on('data', (row) => {
          const { questionnaire_id, question_id, priority } = row;
          db.run(`
            INSERT INTO questionnaire_junction (questionnaire_id, question_id, priority) VALUES (?, ?, ?)
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
  });

  // Clear the questionnaire_questions table before inserting new data
  db.run('DELETE FROM questionnaire_questions', (err) => {
    if (err) {
      console.error('Error clearing the questionnaire_questions table:', err);
    } else {
      console.log('questionnaire_questions table cleared, starting to load new data...');
      
      // Load data into questionnaire_questions
      fs.createReadStream('questionnaire_questions.csv')
        .pipe(csv())
        .on('data', (row) => {
          const { question } = row;
          db.run(`
            INSERT INTO questionnaire_questions ( question) VALUES ( ?)
          `, [question], (err) => {
            if (err) {
              console.error('Error inserting data into questionnaire_questions:', err);
            }
          });
        })
        .on('end', () => {
          console.log('CSV data loaded into questionnaire_questions table');
        });
    }
  });

  // Clear the questionnaire_questionnaires table before inserting new data
  db.run('DELETE FROM questionnaire_questionnaires', (err) => {
    if (err) {
      console.error('Error clearing the questionnaire_questionnaires table:', err);
    } else {
      console.log('questionnaire_questionnaires table cleared, starting to load new data...');
      
      // Load data into questionnaire_questionnaires
      fs.createReadStream('questionnaire_questionnaires.csv')
        .pipe(csv())
        .on('data', (row) => {
          const { name, description } = row;
          db.run(`
            INSERT INTO questionnaire_questionnaires (name) VALUES (?)
          `, [name, description], (err) => {
            if (err) {
              console.error('Error inserting data into questionnaire_questionnaires:', err);
            }
          });
        })
        .on('end', () => {
          console.log('CSV data loaded into questionnaire_questionnaires table');
        });
    }
  });

}


// Empty and Create tables
db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS users`);
  db.run(`DROP TABLE IF EXISTS questionnaire_questionnaires`);
  db.run(`DROP TABLE IF EXISTS questionnaire_questions`);
  db.run(`DROP TABLE IF EXISTS questionnaire_junction`);
  db.run(`DROP TABLE IF EXISTS questionnaire_answers`);
  // Create questionnaire_questionnaires table
  db.run(`
    CREATE TABLE IF NOT EXISTS questionnaire_questionnaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      admin INTEGER DEFAULT 0
    );
  `);
  // Create questionnaire_questions table
  db.run(`
    CREATE TABLE IF NOT EXISTS questionnaire_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL
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
  loadCSVData();
  insertAdminAndClose();
});




