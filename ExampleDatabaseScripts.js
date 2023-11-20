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

  //Get API for database

  app.get("/employees/:id", (req, res, next) => {
    var params = [req.params.id]
    child_db.get(`SELECT * FROM child_db_data where Child_First_Name = ?`, [req.params.id], (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json(row);
      });
});

//Nested Scripts

var childProcess = require('child_process');

function runScript(scriptPath, callback) {

  // keep track of whether callback has been invoked to prevent multiple invocations
  var invoked = false;

  var process = childProcess.fork(scriptPath);

  // listen for errors as they may prevent the exit event from firing
  process.on('error', function (err) {
      if (invoked) return;
      invoked = true;
      callback(err);
  });

  // execute the callback once the process has finished running
  process.on('exit', function (code) {
      if (invoked) return;
      invoked = true;
      var err = code === 0 ? null : new Error('exit code ' + code);
      callback(err);
  });

  // EXAMPLE Script to run in other and invoke a callback when complete:
runScript('./some-script.js', function (err) {
  if (err) throw err;
  console.log('finished running some-script.js');
});
}

//Get API for database

app.get("/employees/:id", (req, res, next) => {
  var params = [req.params.id, req.params.id, req.params.id]
  child_db.get(`SELECT * FROM employees where employee_id = ?`, [req.params.id], (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.status(200).json(row);
    });
});


//Retrieve database for ordered list creation
SELECT COUNT(1) from child_db_data;

//Close database connection

child_db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection to child_db_data.');
  });

  //Example Post function

app.post('/', (req, res)=>{ 
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
  
//Put API for database

/*
app.patch("/employees/", (req, res, next) => {
    var reqBody = re.body;
    db.run(`UPDATE employees set last_name = ?, first_name = ?, title = ?, address = ?, country_code = ? WHERE employee_id = ?`,
        [reqBody.last_name, reqBody.first_name, reqBody.title, reqBody.address, reqBody.country_code, reqBody.employee_id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ updatedID: this.changes });
        });
});

//Delete API

app.delete("/employees/:id", (req, res, next) => {
    db.run(`DELETE FROM user WHERE id = ?`,
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ deletedID: this.changes })
        });
});

*/