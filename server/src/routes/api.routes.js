const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("GOT");
    res.status(200).send("GOT");
});

module.exports = router;