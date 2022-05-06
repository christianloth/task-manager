// Created by Yijin, Reo, and Quentin

const express = require("express");
const router = express.Router();

const MainDB = require("../api/db");

//Compare Current User with Requested User
//Created By: Quentin
function hasAccess(req){
    if(req.body["force"]) return true;
    if(req.session && req.session.loggedin){
        if(req.session.userId == req.params.userId){
            return true;
        }
    }
    return false;
}

//Get User Basic Information
//Created By: Quentin
async function getUser(user_id){
    try{
        let query = `SELECT * FROM users where user_id = ${user_id} LIMIT 1`;
        const user_data = await MainDB.db.query(query);
        let user = user_data["rows"][0];
        console.log(`Selected User ${user["username"]} (UserID: ${user["user_id"]})!`);
        return user;
    }catch (e) {
        console.log(`User ${user_id} is not found`); //;\nError: ${e}
        return null;
    }
}

//Get "Related" information about a user (his tasks,events,categories,and groups)
//Created By: Quentin
async function getUserRelated(attributes, table, user_id){
    try{
        let query = `SELECT ${attributes} FROM ${table} where user_id=${user_id}`;
        const members_data = await MainDB.db.query(query);
        let answer = members_data["rows"];
        return answer;
    }catch(e){
        console.log(e);
        return [];
    }
}

//Get Categories'/Groups' Names based on an ID array
//Created By: Quentin
async function getNamesFromIds(id_arr,attributes,table,condition){
    try{
        promises = [];
        for(var i=0;i<id_arr.length;i++){
            query = `SELECT ${attributes} FROM ${table} where ${condition} = ${id_arr[i][condition]}`;
            const members_data = MainDB.db.query(query);
            promises.push(members_data);
        }
        data = await Promise.all(promises);

        answers = []
        data.forEach(promise => {
            entry = promise["rows"];
            answers.push(entry);
        })
        return answers;
    }catch (e) {
        console.log(e);
        return [];
    }
}

//GET Endpoint for User of Given ID
    //If Logged In, get All User Related Information
    //If Not Logged In, only get basic User information minus the password
//Created By: Quentin
router.get("/:userId", async (req, res) => {
    try{
        const user = await getUser(req.params.userId);
        if(!user){ res.status(400).send(`User ${req.params.userId} is NOT Found`); }
        else{
            let answer = {
                "user" : {
                    "user_id" : user["user_id"],
                    "username" : user["username"],
                    "first_name" : user["first_name"],
                    "last_name" : user["last_name"],
                    "pass_word" : "",
                    "email" : user["email"]
                }
            }

            if(hasAccess(req)){
                answer["user"]["pass_word"] = user["pass_word"];
                const user_tasks = getUserRelated("task_id,task_name","task",req.params.userId);
                const user_events = getUserRelated("event_id,event_name","events",req.params.userId);
                const group_ids = getUserRelated("group_id", "group_member_list",req.params.userId);
                const category_ids = getUserRelated("category_id","category_member",req.params.userId);
                const data = await Promise.all([user_tasks,user_events,group_ids,category_ids]);
                answer["tasks"] = data[0];
                answer["events"] = data[1];
                
                const user_groups = getNamesFromIds(data[2],"group_id, group_name","groups","group_id");
                const user_categories = getNamesFromIds(data[3],"category_id, category_name","category","category_id");
                const data2 = await Promise.all([user_groups, user_categories]);
                answer["groups"] = data2[0];
                answer["categories"] = data2[1];
                    
                res.json(answer);
            }else{
                answer["1"] = "Insufficient permissions to Access Password or Other User-Related Information";
                res.json(answer);
            }
        }
    }catch(e){
        res.status(400).send("Unable to Get User");
        console.error(`Failed to Get User \nError: ${e}`)
    }
});

//Creates New User Given Correct Attributes
//Created By: Quentin
router.post("/create", async (req, res) => {
    try{
        const { user_id, username, first_name, last_name, pass_word, email } = req.body;
        const query = `INSERT INTO users (user_id, username, first_name, last_name, pass_word, email) VALUES ("${user_id}", "${username}", "${first_name}", "${last_name}", "${pass_word}", "${email}")`;
        await MainDB.db.query(query);
        console.log(`User "${username}" with UserID ${user_id} has been created!`);
        res.send(`Successfully Create User "${username}" (UserID: ${user_id})`);
    }catch (e) {
        console.log(`Failed to Create User \nError: ${e}`);
        res.status(400).send("Unable to Create New User");
    }
});

//Update Only Given User Settings
//Created By: Quentin
router.put("/:userId/settings", async (req, res) => {
    try{
        if(hasAccess(req) || req.body["force"]){
            const { user_id, username, first_name, last_name, pass_word, email } = req.body;
            const user = await getUser(req.params.userId);
            if(!user){ res.status(400).send(`User ${req.params.userId} is NOT Found`); }
            else{
                update_query = "UPDATE users SET "
                additions = []
                if(user["username"] != username) additions.push(`username = "${username}"`);
                if(user["first_name"] != first_name) additions.push(`first_name = "${first_name}"`);
                if(user["last_name"] != last_name) additions.push( `last_name = "${last_name}"`);
                if(user["pass_word"] != pass_word) additions.push(`pass_word = "${pass_word}"`);
                if(user["email"] != email) additions.push(`email = "${email}"`);
                for(var i=0; i<additions.length-1; i++){
                    update_query = update_query + additions[i] + ", ";
                }
                update_query = update_query + additions[additions.length-1] + ` where user_id = ${user["user_id"]}`;
                console.log(update_query)

                await MainDB.db.query(update_query)
                res.send(`Updated UserID(${user_id}) Attributes: \n${additions}`)
            }
        }else{
            res.status(400).send("Insufficient permissions to access this page");
        }
    }catch (e) {
        console.log(`Failed to Update User Settings \nError: ${e}`);
        res.status(400).send("Failed to Update User Settings");
    }
});

//Delete User
//Created By: Quentin
router.delete("/:userId", async (req, res) => {
    try{
        if(hasAccess(req) || req.body["force"]){
            const sql = `DELETE from users WHERE user_id = "${req.params.userId}"`;
            await MainDB.db.run(sql);
            console.log(`Successfully Deleted User with UserID: ${req.params.userId}`)
            req.session.destroy();

            // const admin_ids = getUserRelated("admin_id", "admins",req.params.userId);
            //Delete Admin Entries
            // const group_ids = getUserRelated("group_id", "group_member_list",req.params.userId);
            //Delete Group Members Entries
            // const category_ids = getUserRelated("category_id","category_member",req.params.userId);
            //Delete Category Member Entries

            res.send(`Successfully Deleted User with UserID: ${req.params.userId}`)
        }else{
            res.status(400).send("Insufficient permissions to access this page");
        }
    }catch (e) {
        console.log(`Failed to Delete User \nError: ${e}`);
        res.status(400).send("Failed to Delete User");
    }
});

module.exports = router
