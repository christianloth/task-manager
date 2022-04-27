const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");

router.get("/", (req, res) => {
    MainDB.db.all("SELECT * FROM users", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});
//create by Yijin
//list the group_id by the given user
router.get("/:user_id", async (req, res) => {
    try{
        const rows = await MainDB.db.query(
            `SELECT group_id FROM groups where user_id = ${req.params.user_id}`
        );
        res.json(rows);
    } catch (e) {
        res.status(400).send(e);
    }
});

// create by Yijin and Reo
router.post("/create", (req, res) => {
    const { user_id, username, first_name, last_name, pass_word, email } =
        req.body;
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



// create by Yijin 
router.delete("/:user_id", (req, res) => {
    // write code to query
    const { user_id } = req.params;
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
