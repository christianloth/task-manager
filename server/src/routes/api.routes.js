const express = require("express");
const router = express.Router();

const MainDB = require("../api/db");

// Run server and try to go to http://localhost:3001/api/
router.get("/", (req, res) => {
    console.log("GOT");
    res.status(200).send("GOT");
});

// router.get("/:id", (req, res) => {
//     console.log(req.params.id);
//     res.status(200).send("GOT");
// });

router.get("/contacts", (req, res) => {
    // write code to query

    const sql = `SELECT * FROM contacts`;
    MainDB.db.all(sql, (err, rows) => {
        if (err) res.status(401).send(err)

        res.json(rows);
    })
});

router.post("/create/contacts", (req, res) => {
    const { id, first_name, last_name, email, phone } = req.body;
    const sql = `INSERT INTO contacts (contact_id, first_name, last_name, email, phone)
VALUES (${id}, "${first_name}", "${last_name}", "${email}", "${phone}")`;
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
