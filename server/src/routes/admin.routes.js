const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");

// Run server and try to go to http://localhost:3001/api/

router.get("/", (req, res) => {
    // write code to query
    MainDB.db.all("SELECT * FROM admin", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});
// create by Yijin and Reo
router.post("/create", (req, res) => {
    const { admin_id, user_id, group_id } = req.body;
    const sql = `INSERT INTO admin (admin_id ,user_id, group_id)
VALUES ("${admin_id}","${user_id}", "${group_id}")`;
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
router.delete("/:admin_id", (req, res) => {
    // write code to query
    const { admin_id } = req.params;
    const sql = `DELETE FROM admin WHERE admin_id = "${admin_id}"`;
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
