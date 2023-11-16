const sqlite3 = require('sqlite3').verbose();
const express = require("express");
var app = express();

const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

//Connect to database

let child_db = new sqlite3.Database('./db/child_db_data.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database child_db_data.');
  });

  //Open database

  let child_db = new sqlite3.Database('./db/child_db_data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the SQlite database child_db_data.');
  });

//Close database connection

child_db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection to child_db_data.');
  });

  