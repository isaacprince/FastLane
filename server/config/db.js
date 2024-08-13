const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

/*
Database schema for a fastlane user library. 
The library will have one table: Customers.

The Customers table will have the following fields:
- id: an integer that serves as the primary key
- firstName: a text field for the Customer's firstName
- lastName: a text field for the Customer's lastName
- tel: a text field for the Customer's tel
- email: a text field for the Customer's email
- details: a text field for the Customer's details
- created_at: a text field for the Customer's created_at
- updated_at: a text field for the Customer's updated_at

*/

db.run('CREATE TABLE IF NOT EXISTS Customers (id INTEGER PRIMARY KEY, firstName TEXT NOT NULL, ' 
  +'lastName TEXT NOT NULL, tel TEXT NOT NULL, email TEXT NOT NULL, details TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Customers table created.');
    }
});

exports.db = db;