const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const Users = require("../model/user");

router.get("/profile", (req,res,next) => {
 res.json({
    message:"/profile - GET"
 });
});

router.post("/login", (req,res,next) => {
    res.json({
        message:"/login - POST"
     });
});

router.post("/signup", (req,res,next) => {
    res.json({
        message:"/signup - POST"
     });
});


module.exports = router;