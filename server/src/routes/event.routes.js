// Created by Yijin and Reo

const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");

router.get("/", (req, res) => {
    MainDB.db.all("SELECT * FROM events", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});
//Create by Yijin
//Get basic event information in the same group
router.get("/:event_id", async (req, res) => {
    try {
        const rows = await MainDB.db.query(
            `SELECT DISTINCT events.event_name, groups.group_name, users.username, events.event_date, events.event_location, events.descriptions
            FROM groups, users INNER JOIN events ON (events.user_id = users.user_id AND events.group_id = groups.group_id AND events.event_id = ${req.params.event_id})`
          );
        res.json(rows);
    } catch (e) {
        res.status(400).send(e);
    }
});
//Created by Yijin
//update event information
router.put("/:event_id", async (req, res) => {
    const {descriptions, event_name, event_id, event_date, event_location} = req.body;
    const sql = `UPDATE events Set event_name = '${event_name}',event_date = '${event_date}'
    ,event_location = '${event_location}', descriptions = '${descriptions}'  where event_id = ${event_id}`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log(`event information for ${event_name} has been update!`);
    });
    res.send(sql);
});
router.post("/create", (req, res) => {
    const {
        event_id,
        event_name,
        descriptions,
        user_id,
        event_date,
        event_time,
        event_location,
        group_id,
    } = req.body;
    const sql = `INSERT INTO event (event_id, event_name, descriptions, user_id, event_date,event_time,event_location ,group_id)
VALUES ("${event_id}", "${event_name}", "${descriptions}", "${user_id}", "${event_date}", "${event_time}", "${event_location}", "${group_id}")`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted!`);
    });
    res.send(sql);
});

// Created by Yijin
router.delete("/:event_id", (req, res) => {
    const { event_id } = req.params;
    const sql = `DELETE FROM event WHERE event_id = "${event_id}"`;
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
