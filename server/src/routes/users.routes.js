const express = require("express");
const router = express.Router();

const MainDB = require("../api/db");

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

//Generic Function to Run SQL commands, get all or first values, and print errors
async function runSQL(_query,_first){
    try {
        const rows = await MainDB.db.query(_query);
        if(rows["rows"]){ 
            // console.log(rows["rows"])
            if(_first){
                return new Promise(resolve => resolve(rows["rows"][0]))
            }else{
                return new Promise(resolve => resolve(rows["rows"]))
            }
        }else{
            return new Promise(resolve => resolve())
        }
    } catch (e) {
        return new Promise((resolve, reject) => reject(e))
    }
}

//Get "Related" information about a user (his tasks,events,categories,and groups)
function getUserRelated(_userId, _idName, _attribute){
    query = `SELECT ${_idName} FROM ${_attribute} where user_id=${_userId}`
    return runSQL(query,false);
}

//Get Names of Categories/Groups based on an ID array
async function getNamesFromIds(id_arr,_table,_id,_name){
    let data = JSON.parse(JSON.stringify(id_arr));
    answers = []
    for(var i=0;i<id_arr.length;i++){
        query = `SELECT ${_name} FROM ${_table} where ${_id} = ${id_arr[i][_id]}`
        const answer= await runSQL(query,true).then(entry => {
            data[i][_name] = entry[_name]
        })
    }
    return new Promise(resolve => resolve(data))
}

//Compare Current User with Requested Users
function hasAccess(_session, _reqId){
    if(_session.loggedin){
        // console.log(_session.userId)
        if(_session.userId == _reqId){
            return true;
        }
    }
    return false;
}

//GET Endpoint for User of Given ID
//First Authenticates Current User, then find the selected User, then finds Tasks,Events,Groups, and Categories for that user
//Groups and Categories Lists don't store group/category name, so these need to be queried as well
router.get("/:userId", async (req, res) => {
    if(hasAccess(req.session,req.params.userId)){
        query = `SELECT * FROM users where user_id = ${req.params.userId}`
        answer = runSQL(query,true).then(async user => {
            if(user){
                console.log(`Selected User ${user["username"]} (UserID: ${user["user_id"]}) from database!`);
                
                const user_tasks = getUserRelated(req.params.userId, "task_id,task_name","task");
                const user_events = getUserRelated(req.params.userId,"event_id,event_name","events");
                const user_groups = getUserRelated(req.params.userId, "group_id", "group_member_list");
                const user_categories = getUserRelated(req.params.userId, "category_id","category_member");
                await Promise.all([user_tasks,user_events,user_groups,user_categories]).then(async user_data => {
                    const task_data = user_data[0]
                    const event_data = user_data[1]
                    const group_data = await getNamesFromIds(user_data[2],"groups", "group_id", "group_name")
                    const category_data = await getNamesFromIds(user_data[3],"category", "category_id", "category_name")

                    await Promise.all([group_data, category_data]).then(names_data => {
                        res.json([user,task_data,event_data,names_data[0],names_data[1]]);
                    })
                })
            }else{
                res.status(400).send(`User ${req.params.userId} is not found`);
            }
        })
    }else{
        res.status(400).send("Insufficient permissions to access this page");
    }
});

router.post("/create", (req, res) => {
    const { user_id, username, first_name, last_name, pass_word, email } = req.body;
    const query = `INSERT INTO users (user_id, username, first_name, last_name, pass_word, email) VALUES ("${user_id}", "${username}", "${first_name}", "${last_name}", "${pass_word}", "${email}")`;
    try{answer = runSQL(query).then(data => {
        console.log(`A row has been inserted!`);
        res.json(data[1]);
    })}
    catch{
        res.status(400).send("Unable to Create User");
    }
});


//get user setting

router.put("/:userId/settings", async (req, res) => {
    if(hasAccess(req.session,req.params.userId)){
        const { user_id, username, first_name, last_name, pass_word, email } = req.body;
        query = `SELECT * FROM users where user_id = ${req.params.userId}`
        answer = runSQL(query,true).then(async user => {
            console.log(`User ${user["username"]} with user_id = ${user["user_id"]} exists!`);
            // user_attrs = Object.keys(user)
            // console.log(user_attrs)
            update_query = "UPDATE users SET "
            sets = []
            if(user["username"] != username){
                addition = `username = "${username}"`
                sets.push(addition)
            }
            if(user["first_name"] != first_name){
                addition = `first_name = "${first_name}"`
                sets.push(addition)
            }
            if(user["last_name"] != last_name){
                addition = `last_name = "${last_name}"`
                sets.push(addition)
            }
            if(user["pass_word"] != pass_word){
                addition = `pass_word = "${pass_word}"`
                sets.push(addition)
            }
            if(user["email"] != email){
                addition = `email = "${email}"`
                sets.push(addition)
            }
            for(var i; i<sets.length-1; i++){
                update_query = update_query + sets[i] + ", ";
            }
            update_query = update_query + sets[sets.length-1] + ` where user_id = ${user["user_id"]}`;
            console.log(update_query)
            await MainDB.db.query(update_query)
            res.redirect(`/api/users/${req.params.userId}`)
        })
    }else{
        res.status(400).send("Insufficient permissions to access this page");
    }
});



router.delete("/:userId", (req, res) => {
    if(hasAccess(req.session,req.params.userId)){
        const user_id = req.params.userId;
        const sql = `DELETE from users WHERE user_id = "${user_id}"`;
        MainDB.db.run(sql, (err) => {
            if (err) { res.status(400).send(err); }
            res.send(`User ${user_id} has been deleted!`);
        });
    }else{
        res.status(400).send("Insufficient permissions to access this page");
    }
});

module.exports = router
