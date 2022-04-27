const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");

// Run server and try to go to http://localhost:3001/api/
router.get("/", (req, res) => {
    // write code to query
    MainDB.db.all("SELECT * FROM event", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});
// create by Yijin and Reo
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
// create by Yijin
router.delete("/:event_id", (req, res) => {
    // write code to query
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
