const sqlite3 = require('sqlite3');

let child_db = new sqlite3.Database('./db/child_db_data.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Re-Connected to the child database resource... Awaiting input...');
});

// Calls script to populate HTML
app.get('/public/assets/scripts/children.data', (req, res, next) => {
    
  child_db.serialize(()=>{
      child_db.each('SELECT Child_First_Name, Child_Last_Name, Child_Age, Child_Description FROM child_db_data;',function (err, row){
          if (err) {
              res.status(400).json({ "Database data could not be retrieved!": err.message })
              return;
          } else{
        //Programatically send new children data and console the addition when it works : 

        /*

        //Tried via constants but this needs DOMS
        const childList = req.querySelector("childrenPopulateList");
        const childListItem = document.createElement("li");
        childListItem.classList.add("list-item");
        childListItem.setAttribute("id","Firstname");
        childList.appendChild(childListItem);
        */

        //Via inner HTML may be possible?
        var htmlStr = `<li>
        <p>Your Child: </p>
        <h3>${row.Child_First_Name} ${row.Child_Last_Name}</h3>
        <h1>${row.Child_Age}</h1>
        <li>`; 

        res.send(htmlStr)
        console.log(`Parent has child : ${row.Child_First_Name} ${row.Child_Last_Name} of ${row.Child_Age} years old. Adding to page... \n${htmlStr}`);
          }}
        ); 
      });
  });