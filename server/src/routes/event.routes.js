const express = require("express");
const router = express.Router();

const MainDB = require("../api/db");

// Run server and try to go to http://localhost:3001/api/
router.get("/", (req, res) => {
    console.log("GOT");
    res.status(200).send("GOT");
});

router.get("/event", (req, res) => {
    // write code to query
    res.json({
        users: [
            { name: "Reo", age: 10 },
            { name: "Yijin", age: 11 },
        ],
    });
});
router.post("/create", (req, res) => {
    const { event_id, event_name, descriptions, user_id, event_date,event_time,event_location ,group_id} = req.body;
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
module.exports = router;