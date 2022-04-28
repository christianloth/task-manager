// Created by Yijin and Reo

const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");

router.get("/", (req, res) => {
    MainDB.db.all("SELECT * FROM event", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
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
