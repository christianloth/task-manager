const express = require("express");
const router = express.Router();

const MainDB = require("../api/db");

// Run server and try to go to http://localhost:3001/api/
router.get("/", (req, res) => {
    console.log("GOT");
    res.status(200).send("GOT");
});

router.get("/category", (req, res) => {
    // write code to query
    res.json({
        users: [
            { name: "Reo", age: 10 },
            { name: "Yijin", age: 11 },
        ],
    });
});
router.post("/create", (req, res) => {
    const { category_id ,group_id, category_name,descriptions,create_date} = req.body;
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

module.exports = router;
