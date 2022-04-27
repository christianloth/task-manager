const express = require("express");
const router = express.Router();

const MainDB = require("../api/db");
// var Q = require('q')

/*

POST “/signup” (username, password, firsname, lastname, email) ⇒ 
Assert username not in database 
Assert email not in database
Hash password
Insert new user into database
Return User ID
PUT “/:id” (username, password, firsname, lastname, email) ⇒ 
Is user “id” signed in?
Assert “username” not in database 
Assert “email" not in database
Update Database Based on Request Params
Return is_successful?
DELETE “/:id/delete” ⇒ 
Is user “id” signed in?
Delete User From Database
Return is_successful?

*/

function runSQL(sql){
    return new Promise((resolve, reject) => {
        MainDB.db.all(sql, (err, data) => {
            if (err) {
                reject(err);
            }
            // get the last insert id
            resolve(data);
        });
    })
}
// var disp_promise = Q.denodeify(runSQL);
// var get = disp_promise

// Run server and try to go to http://localhost:3001/api/
router.get("/", (req, res) => {
    console.log("GOT");
    res.status(200).send("GOT");
});

router.get("/:id", (req, res) => {
    id = req.params.id;
    
    //Is req.params.id Signed-In
    
    // write code to query
    
    
    var user;
    const sql_user = `SELECT DISTINCT (${id}) FROM users`;
    user =  runSQL(sql_user)
        .then(data => res.send(data))
        .catch(err => console.error(`Error: ${err}`))

    // await MainDB.db.run(sql_user).then( function(err,data){
    //     if (err) {
    //         return console.log(err.message);
    //     }
    //     user = data;
    // })
    // res.send(user)
  
    // var secondPieceOfData;
    // await doStuffWith(dataToUpdate).then(function(data){
    //     secondPieceOfData = data;
    // }
    
    // MainDB.db.run(sql_tasks, (err, user) => {
    //     if (err) {
    //         return console.log(err.message);
    //     }
    //     // get the last insert id
    //     res.send(user)
    // });
    // tasks = ["Write Email to Professor","Finish Computer Science Final"];
    // events = ["Graduation on May 14"];
    // groups = ["CSCE 310","Capstone"];
    // categories = ["Infromation Systems","Finals Presentations"];

    // user = {
    //     id,
    //     tasks,
    //     events,
    //     groups,
    //     categories
    // }

    // res.send(user);
});
router.post("/create", (req, res) => {
    const { user_id, username, first_name, last_name, pass_word, email } = req.body;
    console.log(req.body);
    const sql = `INSERT INTO users (user_id, username, first_name, last_name, pass_word, email) VALUES ("${user_id}", "${username}", "${first_name}", "${last_name}", "${pass_word}", "${email}")`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted!`);
    });
    res.send(sql);
});

module.exports = router;
