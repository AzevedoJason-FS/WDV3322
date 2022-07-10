const express = require('express');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const router = express.Router();
const User = require("../model/user");
const {findUser, saveUser} = require('../../db/db');

router.get("/profile", (req,res,next) => {
 res.json({
    message:"/profile - GET"
 });
});

router.post("/login", (req,res,next) => {
    findUser({email:req.body.email})
        .then(result => {
            if(result.length > 0){
                return res.status(409).json({
                    message: 'User Already Exists'
                })
            }




    bcrypt.compare(req.body.password, req.body.hash, (err, result) => {
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
    })
});

router.post("/signup", (req,res,next) => {
    findUser({email:req.body.email})
        .then(result => {
            if(result.length > 0){
                return res.status(409).json({
                    message: 'User Already Exists'
                })
            }
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){
            res.status(500).json({
                message: err.message
            })
        }else{
            const newUser = new User({
                _id: mongoose.Types.ObjectId(),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                email: req.body.email,
                password: hash,
            })
        
        //Write to Database
        saveUser(newUser)
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "User Signed Up",
                User: {
                    firstName: result.firstName,
                    email: result.email,
                    password: result.password,
                        metadata:{
                            method: req.method,
                            host: req.hostname
                        }
                }
            })
         })
        }
     });
     });
});

module.exports = router;