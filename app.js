const express = require('express');

const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

//set port to 3000 and set main directory to public for now
const port = 3000;
const publicPath = path.join(__dirname,'public'); 

//Load the initial index page
app.get('/', (req, res)=>{ 
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

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

app.get('/public/assets/images/*.png', (req, res)=>{ 
    res.sendFile(path.join(__dirname, '/public/assets/images/*.png'));
});

app.get('/css/style.css', (req, res)=>{ 
    res.sendFile(path.join(__dirname, 'css/style.css'));
});

/*
Example Post function

app.post('/', (req, res)=>{ 
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
*/

//For log purposes that the app is starting
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//404 error handlers
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
  })