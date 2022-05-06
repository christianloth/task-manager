// Created by Yijin, Reo, and Quentin

const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");

//Returns Top 100 Group Names and IDs
router.get("/", (req, res) => {
    MainDB.db.all(
        "SELECT group_id, group_name FROM groups LIMIT 100",
        (err, rows) => {
            if (err) return err;
            res.json({
                rows,
            });
        }
    );
});

//Is Logged-In User an Admin?
//Created By: Quentin
async function hasAccess(req) {
    if (req.session && req.session.loggedin) {
        admins = await getAdmins(req.params.group_id);
        for (var i = 0; i < admins.length; i++) {
            admin_id = admins[i]["user_id"];
            if (req.session.userId == admin_id) return true;
        }
    }
    if (req.body["force"]) return true;
    return false;
}

//Get General Group Information give a GroupID
//Created By: Quentin
async function getGroup(group_id) {
    try {
        let group_query = `SELECT * FROM groups where group_id = '${group_id}' LIMIT 1`;
        const group_data = await MainDB.db.query(group_query);
        let group = group_data["rows"][0];
        console.log(
            `Selected Group: "${group["group_name"]}" (ID: ${group_id})!`
        );
        return group;
    } catch (e) {
        console.log(`Group ${group_id} not found;\nError: ${e}`);
        return null;
    }
}

//Get All Group Members' UserIDs give a GroupID
//Created By: Quentin
async function getMemberIds(group_id) {
    try {
        let members_query = `SELECT user_id FROM group_member_list where group_id = '${group_id}'`;
        const members_data = await MainDB.db.query(members_query);
        let member_ids = members_data["rows"];
        return member_ids;
    } catch (e) {
        console.log(e);
        return [];
    }
}

//Get a Username given a UserID
//Created By: Quentin
async function getUserUsername(user_id) {
    try {
        let query = `SELECT username FROM users where user_id = ${user_id} LIMIT 1`;
        const user_data = await MainDB.db.query(query);
        let user = user_data["rows"][0];
        return user["username"];
    } catch (e) {
        console.log(e);
        return "";
    }
}

//Get All Users' Names and IDs given an array of UserIDs
//Created By: Quentin
async function getNames(user_arr) {
    try {
        let members = [];
        for (var i = 0; i < user_arr.length; i++) {
            let user_id = user_arr[i]["user_id"];
            const username = await getUserUsername(user_id);
            members.push({});
            members[i]["user_id"] = user_id;
            members[i][username] = `${username}`;
        }
        return members;
    } catch (e) {
        console.log(e);
        return [];
    }
}

//Get all Group Admins' Names and UserIDs give a GroupID
//Created By: Quentin
async function getAdmins(group_id) {
    try {
        let admin_query = `SELECT user_id FROM admins where group_id = '${group_id}'`;
        const admin_data = await MainDB.db.query(admin_query);
        let admin_ids = admin_data["rows"];
        const admins = await getNames(admin_ids);
        return admins;
    } catch (e) {
        console.log(e);
        return [];
    }
}

//Get all Group Events given a GroupID
//Created By: Quentin
async function getEvents(group_id) {
    try {
        let event_query = `SELECT event_id, event_name, event_date FROM events where group_id = '${group_id}'`;
        const event_data = await MainDB.db.query(event_query);
        let events = event_data["rows"];
        return events;
    } catch (e) {
        console.log(e);
        return [];
    }
}

//Get all Category Tasks given a CategoryID
//Created By: Quentin
async function getCategoryTasks(category_id) {
    try {
        let cat_query = `SELECT task_id, task_name, complete FROM task where category_id = '${category_id}'`;
        const task_data = await MainDB.db.query(cat_query);
        let tasks = task_data["rows"];
        return tasks;
    } catch (e) {
        console.log(e);
        return [];
    }
}

//Get all Categories and their Tasks give a GroupID
//Created By: Quentin
async function getCategories(group_id) {
    try {
        let cat_query = `SELECT category_id, category_name FROM category where group_id = '${group_id}'`;
        const cat_data = await MainDB.db.query(cat_query);
        let category_arr = cat_data["rows"];

        let categories = [];
        for (var i = 0; i < category_arr.length; i++) {
            let category = category_arr[i];
            categories.push({});
            categories[i]["category_id"] = category["category_id"];
            categories[i]["category_name"] = category["category_name"];
            categories[i]["tasks"] = [];
        }

        for (var i = 0; i < categories.length; i++) {
            let cat_id = categories[i]["category_id"];
            const task_arr = await getCategoryTasks(cat_id);
            categories[i]["tasks"] = task_arr;
        }
        return categories;
    } catch (e) {
        console.log(e);
        return [];
    }
}

//GET Group from ID
//If Member: Give All Group-Related Infromation
//If not Member Give Basic Group Information
//Created By: Quentin
router.get("/:group_id", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id);
        if (!group)
            res.status(400).send(`Group ${req.params.group_id} is NOT Found`);
        else {
            const members_ids = await getMemberIds(req.params.group_id);
            if (
                members_ids.includes(req.session.user_id) ||
                req.body["force"] ||
                true
            ) {
                const admins = await getAdmins(req.params.group_id);
                const members = await getNames(members_ids);
                const events = await getEvents(req.params.group_id);
                const categories = await getCategories(req.params.group_id);
                const final = {
                    info: group,
                    admins: admins,
                    members: members,
                    events: events,
                    categories: categories,
                };
                res.json(final);
            } else {
                answer = {
                    1: "Insufficient Permissions to See Entire Group Information",
                    info: group,
                };
                res.json(answer);
            }
        }
    } catch (e) {
        console.log(`Failed to Get Group \nError: ${e}`);
        res.status(400).send("Unable to Get Group");
    }
});

//Created Quentin
//Create new group from (groupID, userID, groupName, Description, and icon)
router.post("/create", async (req, res) => {
    try {
        const { group_id, user_id, group_name, description, icon } = req.body;
        const sql = `INSERT INTO groups (group_id, user_id, group_name, descriptions, icon) VALUES ("${group_id}", "${user_id}", "${group_name}", "${description}", "${icon}")`;
        await MainDB.db.query(sql);
        console.log(
            `Group "${group_name}" with GroupID ${group_id} has been created!`
        );

        //Create Admin Entry From Owner (user_id)

        res.send(
            `Successfully Create Group "${group_name}" (GroupID: ${group_id})`
        );
    } catch (e) {
        console.log(`Failed to Create New Group \nError: ${e}`);
        res.status(400).send("Unable to Create New Group");
    }
});

//Created by Quentin
//update group name and description
router.put("/:group_id/settings", async (req, res) => {
    try {
        if (await hasAccess(req)) {
            const {
                group_id = req.params.group_id,
                user_id,
                group_name,
                description,
                icon,
            } = req.body;
            const group = await getGroup(req.params.group_id);
            if (!group) {
                res.status(400).send(
                    `Group ${req.params.group_id} is NOT Found`
                );
            } else {
                update_query = "UPDATE groups SET ";
                additions = [];
                if (group["user_id"] != user_id)
                    additions.push(`user_id = "${user_id}"`);
                if (group["group_name"] != group_name)
                    additions.push(`group_name = "${group_name}"`);
                if (group["descriptions"] != description)
                    additions.push(`descriptions = "${description}"`);
                if (group["icon"] != icon) additions.push(`icon = "${icon}"`);
                for (var i = 0; i < additions.length - 1; i++) {
                    update_query = update_query + additions[i] + ", ";
                }
                update_query =
                    update_query +
                    additions[additions.length - 1] +
                    ` where group_id = ${group["group_id"]}`;
                console.log(update_query);

                await MainDB.db.query(update_query);
                res.send(
                    `Updated GroupID(${group_id}) Attributes: \n${additions}`
                );
            }
        } else {
            res.status(400).send(
                "Insufficient permissions to access this page"
            );
        }
    } catch (e) {
        console.log(`Failed to Update Group Settings \nError: ${e}`);
        res.status(400).send("Failed to Update Group Settings");
    }
});

// Created by Quentin and Yijin
router.delete("/:group_id", async (req, res) => {
    try {
        if (await hasAccess(req)) {
            const sql = `DELETE FROM groups WHERE group_id = "${req.params.group_id}"`;
            await MainDB.db.run(sql);
            console.log(
                `Successfully Deleted Group with GroupID: ${req.params.group_id}`
            );

            //Delete Admin Entries
            //Delete Group Members Entries
            //Delete Events
            //Categories
            //Delete Each Category's Tasks
            //Delete Each Category's Member Entries
            //Delete Category

            res.send(
                `Successfully Deleted Group with GroupID: ${req.params.group_id}`
            );
        } else {
            res.status(400).send(
                "Insufficient permissions to access this page"
            );
        }
    } catch (e) {
        console.log(`Failed to Delete Group \nError: ${e}`);
        res.status(400).send("Failed to Delete Group and Group-Related Data");
    }
});

module.exports = router;
