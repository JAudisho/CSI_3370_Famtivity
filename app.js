const express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3');

//Possible implementation of npm better-sqlite3
//const Database = require('better-sqlite3');
//const db = require('better-sqlite3')('foobar.db', options);

const app = express();
const path = require('path');
const http = require('http');
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
//app.use(express.static(path.join(__dirname, 'public')));


//set port to 3000 and set main directory to public for now
const port = 3000;

//Open database

let child_db = new sqlite3.Database('./db/child_db_data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the child database resource... Awaiting input...');
  });

//Load database into children_data object
//Sets a global var to contain JSON
var children_data = [];

//children_data loadDb Method initiator
function loadDb(){
child_db.each('SELECT Child_First_Name, Child_Last_Name, Child_Age, Child_Description FROM child_db_data;',function (err, row){
    if (err) {
        res.status(400).json({ "Database data could not be retrieved!": err.message })
        return;
    }
    children_data.push({
        Child_First_Name: row.Child_First_Name,
        Child_Last_Name: row.Child_Last_Name,
        Child_Age: row.Child_Age,
        Child_Description: row.Child_Description,
    });
});}

//Calls "loadDb method to actually populate the db"
loadDb();

//DYNAMIC PAGE ROUTES :

//GET Route below to populate Childen into the HTML/EJS, & loads the Children page
    app.get('/children.ejs', (req, res)=>{

    loadDb();

    //Send JSON to client for rendering of Children.ejs file after 350ms buffer
    setTimeout(function(){
        res.render('children',{'children_data' : children_data});
    },20);

    //Output JSON in totallity to confirm data was sent
    console.log(JSON.stringify(children_data));
    });

//POST Route below to populate Childen into the database, then re-loads the Children page
app.post('/children.ejs', (req, res, next) => {
    child_db.serialize(()=>{
    child_db.run(`INSERT INTO child_db_data (Child_First_Name, Child_Last_Name, Child_Age, Child_Description) VALUES (?,?,?,?)`,[req.body.childFirstName,req.body.childLastName,req.body.childAge,req.body.childDesc],
        function (err, result) {
            if (err) {
                res.status(400).json({ "Database could not be updated!": err.message })
                return;
            }
                //Output data has been added to database
                console.log(`Child has been added to the parent!`);
        });
    });

    loadDb();

    //Send JSON to client for rendering of Children.ejs file after 350ms buffer
    setTimeout(function(){
        res.render('children',{'children_data' : children_data});
    },20);

    //Output JSON in totallity to confirm data was sent
    console.log(JSON.stringify(children_data));
});

//Load the initial index page
app.get('/', (req, res)=>{ 
    res.render('index');
});

app.post('/', (req, res) => {
    res.send('POST request to the homepage')
  })

  //Load the help index page
  app.get('/help.ejs', (req, res)=>{ 
    res.render(path.join(__dirname, 'public/help.ejs'));
});

//Load the home index page
app.get('/index.ejs', (req, res)=>{ 
    res.render(path.join(__dirname, 'public/index'));
});

//Load the about index page
app.get('/about.ejs', (req, res)=>{ 
    res.render(path.join(__dirname, 'public/about.ejs'));
});

//Load the coach index page
app.get('/coach.ejs', (req, res)=>{ 
    res.render(path.join(__dirname, 'public/coach.ejs'));
});

//Load the events index page
app.get('/events.ejs', (req, res)=>{ 
    res.render(path.join(__dirname, 'public/events.ejs '));
});

//Serves static files (NEEDS TO BE BELOW OTHER NON-STATIC-ROUTES)
const publicPath = path.join(__dirname,'public'); 
app.set('views',path.join(publicPath));
app.use(express.static(publicPath));

//Load images (Static folder)
app.get('/assets/images/.*png', (req, res)=>{ 
    res.render(path.join(__dirname, 'public/assets/images/*.png'));
});

//Load css (Static folder)
app.get('/css/style.css', (req, res)=>{ 
    res.render(path.join(__dirname, 'public/css/style.css'));
});

//For log purposes that the app is starting on port 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

//404 error handlers
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
});