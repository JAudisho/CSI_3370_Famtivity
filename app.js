const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const path = require('path');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//set port to 3000 and set main directory to public for now
const port = 3000;
const publicPath = path.join(__dirname,'public'); 

//Open database

let child_db = new sqlite3.Database('./db/child_db_data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the child database resource... Awaiting input...');
  });

//Post API for database

app.post('/children.html', (req, res, next) => {
    child_db.serialize(()=>{
    child_db.run(`INSERT INTO child_db_data (Child_First_Name, Child_Last_Name, Child_Age, Child_Description) VALUES (?,?,?,?)`,[req.body.childFirstName,req.body.childLastName,req.body.childAge,req.body.childDesc],
        function (err, result) {
            if (err) {
                res.status(400).json({ "Database could not be updated!": err.message })
                return;
            }
            res.redirect('back');
        });
    });
    console.log('Added child to database...\nReturning user to child page...');
});

//Load the initial index page
app.get('/', (req, res)=>{ 
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/', (req, res) => {
    res.send('POST request to the homepage')
  })


app.get('/public/index.html', (req, res)=>{ 
    res.sendFile(path.join(__dirname, 'public/index.html'));
    app.listen(port, () => {
        console.log(`Index page get`)
      })
});

app.get('/public/about.html', (req, res)=>{ 
    res.sendFile(path.join(__dirname, 'public/about.html'));
    app.listen(port, () => {
        console.log(`About page get`)
      })
});

/*
app.get('/public/assets/images/*.png', (req, res)=>{ 
    res.sendFile(path.join(__dirname, '/public/assets/images/*.png'));
});
*/

app.get('/css/style.css', (req, res)=>{ 
    res.sendFile(path.join(__dirname, 'css/style.css'));
});

//Example Post function

app.post('/', (req, res)=>{ 
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


//For log purposes that the app is starting
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

//404 error handlers
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
});


//Get API for database

  app.get("/employees/:id", (req, res, next) => {
    var params = [req.params.id]
    child_db.get(`SELECT * FROM employees where employee_id = ?`, [req.params.id], (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json(row);
      });
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