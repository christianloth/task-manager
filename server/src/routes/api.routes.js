const express = require("express");
const router = express.Router();

// Run server and try to go to http://localhost:3001/api/
router.get("/", (req, res) => {
    console.log("GOT");
    res.status(200).send("GOT");
});

router.get("/users", (req, res) => {
    // write code to query
    res.json({ users: [{name: 'Reo', age: 10},{name: 'Yijin', age: 11}] })
})

router.post("/users", (req, res) => {
    console.log(req.body);
    res.send('Got Post!')
})

module.exports = router;