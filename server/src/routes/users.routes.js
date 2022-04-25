const express = require("express");
const router = express.Router();

const MainDB = require("../api/db");

// Run server and try to go to http://localhost:3001/api/
router.get("/", (req, res) => {
    // write code to query
    MainDB.db.all("SELECT * FROM users", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});
router.post("/create", (req, res) => {
    const { user_id, username, first_name, last_name, pass_word, email } = req.body;
    console.log(req.body);
    const sql = `INSERT INTO users (user_id, username, first_name, last_name, pass_word, email)
VALUES ("${user_id}", "${username}", "${first_name}", "${last_name}", "${pass_word}", "${email}")`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted!`);
    });
    res.send(sql);
});
router.delete("/:user_id", (req, res) => {
    // write code to query
    const {user_id} = req.params;
    const sql = `DELETE FROM users WHERE user_id = "${user_id}"`;
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
