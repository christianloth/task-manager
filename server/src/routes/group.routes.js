// Created by Yijin, Reo, and Quentin

const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");

router.get("/", (req, res) => {
    MainDB.db.all("SELECT * FROM groups", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});

//Quentin
async function getGroup(group_id){
    let group_query = `SELECT * FROM groups where group_id = '${group_id}'`;
    const group = MainDB.db.query(group_query);
    let members_query = `SELECT * FROM group_member_list where group_id = '${group_id}'`;
    const members = MainDB.db.query(members_query);
    data = await Promise.all([group,members]);
    return data;
}

async function getUserUsername(user_id){
    query = `SELECT * FROM users where user_id = ${user_id}`;
    user_data = await MainDB.db.query(query);
    user = user_data["rows"][0];
    username = user["username"];
    return username;
}

async function getMemberNames(member_arr){
    members = []
    usernames = []

    member_arr.forEach(member => {
        user_id = member["user_id"];
        username = getUserUsername(user_id);
        members.push({});
        usernames.push(username)
    })
    data = await Promise.all(usernames)
    for(var i = 0; i < members.length; i++){
        user_id = member_arr[i]["user_id"];
        username = data[i]
        members[i]["user_id"] = user_id;
        members[i][username] = `${username}`
    }

    return new Promise(resolve => resolve(members));
}

async function getAdmins(group_id){
    let admin_query = `SELECT * FROM admins where group_id = '${group_id}'`;
    admin_data = await MainDB.db.query(admin_query)
    admin_ids = admin_data["rows"]
    const admins = await getMemberNames(admin_ids)
    return new Promise(resolve => resolve(admins))
}

async function getCategoryTasks(category_id){
    let cat_query = `SELECT * FROM task where category_id = '${category_id}'`;
    task_data = await MainDB.db.query(cat_query)
    tasks = task_data["rows"]
    return new Promise(resolve => resolve(tasks))
}

async function getCategories(group_id){
    let cat_query = `SELECT * FROM category where group_id = '${group_id}'`;
    cat_data = await MainDB.db.query(cat_query)
    category_arr = cat_data["rows"]
    
    categories = []
    for(var i = 0; i < category_arr.length; i++){
        category = category_arr[i];
        categories.push({})
        categories[i]["category_id"] = category["category_id"]
        categories[i]["category_name"] = category["category_name"]
        categories[i]["tasks"] = []
    }
    
    for(var i = 0; i < categories.length; i++){
        cat_id = categories[i]["category_id"]
        task_arr = await getCategoryTasks(cat_id);
        categories[i]["tasks"] = task_arr;
    }
    return new Promise(resolve => resolve(categories))
}

async function getEvents(group_id){
    let event_query = `SELECT * FROM events where group_id = '${group_id}'`;
    event_data = await MainDB.db.query(event_query)
    events = event_data["rows"]
    return new Promise(resolve => resolve(events))
}


//GET Group from ID 
    //getGroup(group_id)
    //getGroupMembers
    //If Member:
        //getGroupAdmins(group_id)
        //getGroupCategories(group_id)
        //getGroupTasks
        //getGroupEvents
    //If not Member Give Basic Group Information 
//get usernamae group_name category_name and event_name base on the group_id
router.get("/:group_id", async (req, res) => { //Create by Quentin
    const group_data = await getGroup(req.params.group_id)
    group = group_data[0]["rows"][0]
    member_ids = group_data[1]["rows"]
    // if(member_ids.includes(req.session.user_id)){
    const admins = await getAdmins(req.params.group_id);
    const members = await getMemberNames(member_ids);
    const events = await getEvents(req.params.group_id)
    const categories = await getCategories(req.params.group_id);
    const final = {
        "info" : group,
        "admins" : admins,
        "members" : members,
        "events" : events,
        "categories" : categories
    }
    res.json(final);
    // }
    // else{
    //     res.json(group);
    // }
});
//Quentin

//Created by Yijin and Quentin
router.post("/create", (req, res) => {
    const { group_id, user_id, group_name, description, icon } = req.body;
    const sql = `INSERT INTO group (group_id, user_id, group_name, description)
VALUES ("${group_id}", "${user_id}", "${group_name}", "${description}", "${icon}")`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A New Group Has Been Created!`);
    });
    res.send(sql);
});

//update group name and description
router.put("/:group_id", async (req, res) => {
    const {descriptions, group_name, group_id} = req.body;
    const sql = `UPDATE groups Set group_name = '${group_name}',descriptions = '${descriptions}'  where group_id = ${group_id}`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log(`group name and description for group ${group_id} has been update!`);
    });
    res.send(sql);
});


// Created by Yijin
router.delete("/:group_id", (req, res) => {
    const { group_id } = req.params;
    const sql = `DELETE FROM groups WHERE group_id = "${group_id}"`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been deleted!`);
    });
    res.send(sql);
});

module.exports = router;
