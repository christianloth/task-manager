const express = require("express");
const router = express.Router();

const MainDB = require("../api/db");

// Run server and try to go to http://localhost:3001/api/

router.get("/", (req, res) => {
    // write code to query
    MainDB.db.all("SELECT * FROM category", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});
router.post("/create", (req, res) => {
    const { category_id, group_id, category_name, descriptions, create_date } =
        req.body;
    const sql = `INSERT INTO category (category_id ,group_id, category_name,descriptions,create_date)
VALUES ("${category_id}","${group_id}", "${category_name}","${descriptions}", "${create_date}")`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted!`);
    });
    res.send(sql);
});
router.delete("/:category_id", (req, res) => {
    // write code to query
    const {category_id} = req.params;
    const sql = `DELETE FROM category WHERE category_id = "${category_id}"`;
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
