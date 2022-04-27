const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");

// Run server and try to go to http://localhost:3001/api/

router.get("/", (req, res) => {
    // write code to query
    MainDB.db.all("SELECT * FROM group_member", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});
// create by Yijin and Reo
router.post("/create", (req, res) => {
    const { grouplist_id, group_id, user_id } = req.body;
    const sql = `INSERT INTO group_member (grouplist_id ,group_id, user_id)
VALUES ("${grouplist_id}","${group_id}", "${user_id}")`;
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

router.delete("/:grouplist_id", (req, res) => {
    // write code to query
    const { grouplist_id } = req.params;
    const sql = `DELETE FROM group_member WHERE grouplist_id = "${grouplist_id}"`;
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
