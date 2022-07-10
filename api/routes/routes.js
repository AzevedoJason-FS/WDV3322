const express = require('express');
const bcrypt = require("bcrypt");
const { Mongoose } = require('mongoose');
const router = express.Router();
const Users = require("../model/user");

const user = {}

router.get("/profile", (req,res,next) => {
 res.json({
    message:"/profile - GET"
 });
});

router.post("/login", (req,res,next) => {
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(err) return res.status(501).json({message: err.message});

        if(result){
            res.status(200).json({
                message: "Authorization Successful",
                result: result,
            });
        }
            else{
                res.status(401).json({
                    message: "Authorization Failed",
                    result: result,
                });
            }
    })
});

router.post("/signup", (req,res,next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){
            res.status(500).json({
                message: err.message
            })
        }else{
            user.password = hash;
            res.status(200).json({
                password: hash
            })
        }
    })
});


module.exports = router;