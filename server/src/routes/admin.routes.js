const express = require("express");
const router = express.Router();

const MainDB = require("../api/db");

// Run server and try to go to http://localhost:3001/api/
// router.get("/", (req, res) => {
//     console.log("GOT");
//     res.status(200).send("GOT");
// });

router.get("/admin", (req, res) => {
    // write code to query
    res.json({
        users: [
            { name: "Reo", age: 10 },
            { name: "Yijin", age: 11 },
        ],
    });
});
router.post("/admin/create", (req, res) => {
    const { admin_id ,user_id, group_id} = req.body;
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

module.exports = router;

// router.post("/login", (req,res) => {
//     username = req.username
//     password = req.password

//     //check database if exist

//     //update session

//     //retiurn token redirect to User Dashboard ("/:id")
// })
