const express = require('express');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const router = express.Router();
const User = require("../model/user");
const jwt = require('jsonwebtoken');
const {findUser, saveUser} = require('../../db/db');
const user = {};

router.get("/profile",(req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.jwt_key);
    
        res.status(200).json({
            message: 'Verified',
            decoded: decoded,
        })
    }
   catch(error){
       res.status(401).json({
           message: 'authorization failed'
       })
   }
});

router.post("/login", (req,res,next) => {
    findUser({email:req.body.email})
        .then(result => {
            if(result.length === 0){
                return res.status(401).json({
                    message: 'No user found with that email'
                })
            }
    const email = req.body.email;

    const token = jwt.sign({email:email}, process.env.jwt_key, {expiresIn: '20m'});

    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(err) return res.status(501).json({message: err.message});

            if(result){
                res.status(200).json({
                    message: "Authorization Successful | Welcome",
                    result: result,
                    token: token,
                });
            }
            else{
                res.status(401).json({
                    message: "Authorization Failed | Incorrect Password",
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
            user.password = hash;
            const newUser = new User({
                _id: mongoose.Types.ObjectId(),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                email: req.body.email,
                password: user.password,
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