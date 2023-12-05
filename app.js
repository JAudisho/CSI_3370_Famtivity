/*_____________________________________________________________________________________________________________________________________________________
    ______                __  _       _ __           _____                              ___              
   / ____/___ _____ ___  / /_(_)   __(_) /___  __   / ___/___  ______   _____  _____   /   |  ____  ____ 
  / /_  / __ `/ __ `__ \/ __/ / | / / / __/ / / /   \__ \/ _ \/ ___/ | / / _ \/ ___/  / /| | / __ \/ __ \
 / __/ / /_/ / / / / / / /_/ /| |/ / / /_/ /_/ /   ___/ /  __/ /   | |/ /  __/ /     / ___ |/ /_/ / /_/ /
/_/    \__,_/_/ /_/ /_/\__/_/ |___/_/\__/\__, /   /____/\___/_/    |___/\___/_/     /_/  |_/ .___/ .___/ 
                                        /____/                                            /_/   /_/      
_____________________________________________________________________________________________________________________________________________________*/

//NODE.JS SERVER APP SET UP: __________________________________________________________________________________________________________________________
//Set app constants
//Use Express.Js & EJS node npm extentions for app
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

//Set router if needed (Honestly, idk how to use it lols - Drew)
var router = express.Router();
const path = require('path');

//Use sqlite3 database
const sqlite3 = require('sqlite3');

//NOTE: Below code allows possible implementation of npm better-sqlite3. Kept commented for possible future use:
//const Database = require('better-sqlite3');
//const db = require('better-sqlite3')('foobar.db', options);

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
//NOTE: Code below is to set static paths for troubleshooting purposes. Uncomment when needed.
//app.use(express.static(path.join(__dirname, 'public')));

//Set port to 3000 and set main directory to public for now
const port = 3000;

//Below sets user variable to be set via login page
user = 0;
var Userexists = false;

//Dynamic JSON obj to save User/Pass input to match to db
var userInfo = [];

//DATABASE CONNECTIVITY SET UP : ______________________________________________________________________________________________________________________
//Open database connection
let child_db = new sqlite3.Database('./db/child_db_data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the Famtivity server database resource...');
});

//Code block below loads database into children_data object
//Sets a global var to contain JSON
var children_data = [];

//children_data loadDb Method initiator
function loadDb(){

//Db query to child_db
child_db.each('SELECT Child_First_Name, Child_Last_Name, Child_ParentID, Child_Age, Child_Description FROM child_db_data;',function (err, row){
    if (err) {
        res.status(400).json({ "Database data could not be retrieved!": err.message })
        return;
    }
    children_data.push({
        Child_First_Name: row.Child_First_Name,
        Child_Last_Name: row.Child_Last_Name,
        Child_ParentID : row.Parent_ID,
        Child_Age: row.Child_Age,
        Child_Description: row.Child_Description,
    });

    //NOTE: You can uncomment code below to check output JSON in totallity to confirm if data was sent, or if there's an error with loading the database JSON
    //console.log(JSON.stringify(children_data));

});}

//children_data refreshDb() Method initiator
function refreshDb(){

    //Initialize a temp var to use for late evaluation if DB is updated
    var currentDBInit = [];
    
    //Typical db query similar to earlier
    child_db.each('SELECT Child_First_Name, Child_Last_Name, Child_ParentID, Child_Age, Child_Description FROM child_db_data;',function (err, row){
        if (err) {
            res.status(400).json({ "Database data could not be retrieved!": err.message })
            return;
        }
        //Pushes current DB items to currentDBInit[]
        currentDBInit.push({
            Child_First_Name: row.Child_First_Name,
            Child_Last_Name: row.Child_Last_Name,
            Child_ParentID : row.Parent_ID,
            Child_Age: row.Child_Age,
            Child_Description: row.Child_Description,
        });
    });

    //Logic to evaluate if the children_data.json object is equivalent to current database data. Otherwise, resets and updates it.
    if(currentDBInit != children_data){
        children_data = [];
        loadDb();
    }
    console.log('Database is currently up to date... Loading data for the page...');
}



//DYNAMIC PAGE ROUTES : _______________________________________________________________________________________________________________________________

//GET Route below to populate Childen into the HTML/EJS, & loads the Children page
    app.get('/children.ejs', (req, res)=>{
    refreshDb();

    //Send JSON to client for rendering of Children.ejs file after 20ms buffer
    setTimeout(function(){
        //Below code block is a function redirects user from any page if not logged in
        console.log("LOGIN|Checking user credentials...");
        if (user == 0){
            // if user is not logged-in redirect back to login page //
            console.log("LOGIN|Checking user credentials...");
            console.log('LOGIN|User NOT Logged In!');
        return res.render(path.join(__dirname, 'public/login.ejs'));
        }else{  console.log('LOGIN|Logged In user granted access!');
        return res.render('children',{'children_data' : children_data});}
    },20);
    });

//POST Route below to populate Childen into the database, then re-loads the Children page
app.post('/children.ejs', (req, res, next) => {

    //Calls "loadDb()" method to do initial population of the db for the session
    loadDb();

    child_db.serialize(()=>{
    child_db.run(`INSERT INTO child_db_data (Child_First_Name, Child_Last_Name, Child_ParentID, Child_Age, Child_Description) VALUES (?,?,?,?,?)`,
    [req.body.childFirstName,req.body.childLastName,user,req.body.childAge,req.body.childDesc],
        function (err, result) {
            if (err) {
                res.status(400).json({ "Database could not be updated!": err.message })
                return;
            }
                //Output data has been added to database
                console.log(`Child has been added to the parent!`);
        });
    });

    //Call refreshDb() method
    refreshDb();

    //Send reloads the db after 20ms buffer
    setTimeout(function(){
        loadDb();
    },20);

    //Send JSON to client for rendering of Children.ejs file after 40ms buffer
    setTimeout(function(){
        res.render('children',{'children_data' : children_data});
    },40);
});

//Load the initial index page
app.get('/', (req, res)=>{ 

    res.render('index');
});

app.post('/', (req, res) => {
    res.send('POST request to the homepage')
  })

//Load the home index page
app.get('/index.ejs', (req, res)=>{ 
    
    res.render(path.join(__dirname, 'public/index'));
});

//Post the home index page if reqested (Most likely after login)
app.post('/loginattempt', (req, res)=>{

    console.log(`Form was sent!`);

    //Below block of code tests if input matches db
    child_db.serialize(()=>{
    child_db.get("SELECT Parent_ID, Username, Password FROM users WHERE Username = ?", req.body.usernameInpt, function (err, dbresult){
        if (err) {
            res.status(490).json({ "DB cannot be accessed": err.message })
                return;
        }else{
        //Debug 2
        console.log('DEBUGTEST|DB data isn\'t null!');

        //Code below tests if theres a match with DB data
        try {
        userInfo.push({
        user_ID: dbresult.Parent_ID,
        Username: dbresult.Username,
        Password: dbresult.Password,
            });

            //Trying to get value of what current user is logged in from db
            console.log('DEBUGTEST|User MATCHED in DB');
            console.log(JSON.stringify(userInfo));
            
            user =  parseInt(JSON.stringify(userInfo.user_ID));
            
            //Send index to client for rendering after 20ms buffer if user is logged in from above
            setTimeout(function(){
                console.log("Sending logged in user to their children page");
                return res.render('children',{'children_data' : children_data});
                },20); 
        } catch (error) {
            console.log('DEBUGTEST|NO user match in DB');
            Userexists = false;
            console.log("Sent user back to main page");
            return res.render(path.join(__dirname, 'public/index.ejs'));
        }
    }})
    });
});

//Load the help index page
app.get('/help.ejs', (req, res)=>{ 
res.render(path.join(__dirname, 'public/help.ejs'));
});

//Load the about index page
app.get('/about.ejs', (req, res)=>{ 
    
    res.render(path.join(__dirname, 'public/about.ejs'));
});

//Load the coach index page
app.get('/coach.ejs', (req, res)=>{ 
    //Below code block is a function redirects user from any page if not logged in
console.log("LOGIN|Checking user credentials...");
if (user == 0){
    // if user is not logged-in redirect back to login page //
    console.log('LOGIN|User NOT Logged In!');
    return res.render(path.join(__dirname, 'public/login.ejs'));
    }
    console.log('LOGIN|Logged In user granted access!');
    return res.render(path.join(__dirname, 'public/coach.ejs'));
});

//Load the events index page
app.get('/events.ejs', (req, res)=>{ 
    //Below code block is a function redirects user from any page if not logged in
console.log("LOGIN|Checking user credentials...");
if (user == 0){
    // if user is not logged-in redirect back to login page //
    console.log('LOGIN|User NOT Logged In!');
    return res.get(path.join(__dirname, 'public/login.ejs'));
    }
    console.log('LOGIN|Logged In user granted access!');
    return res.render(path.join(__dirname, 'public/events.ejs'));
});

//Load the login index page
app.get('/login.ejs', (req, res)=>{ 
    res.get(path.join(__dirname, 'public/login.ejs'));
});


//STATIC PAGE ROUTES AND RESOURCES : __________________________________________________________________________________________________________________

//Serves as routers for static files (NOTE: NEEDS TO BE BELOW OTHER NON-STATIC-ROUTES)
const publicPath = path.join(__dirname,'public'); 
app.set('views',path.join(publicPath));
app.use(express.static(publicPath));

//Load image resources (Static folder)
app.get('/assets/images/.*png', (req, res)=>{ 
    res.render(path.join(__dirname, 'public/assets/images/*.png'));
});

//Load css resources (Static folder)
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