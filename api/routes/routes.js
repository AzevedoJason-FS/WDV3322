const express = require('express');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const router = express.Router();
const User = require("../model/user");
const jwt = require('jsonwebtoken');
const {findUser, saveUser} = require('../../db/db');
const checkAuth = require('../../auth/checkAuth');
const user = {};

/**
 * @swagger
 * tags:
 *  name: User Profile
 *  description: This is for the User Profile
 * /users/profile:
 *  get:
 *      tags: [User Profile]
 *      responses:
 *          200:
 *              description: Success
 *          401:
 *              description: Authorization failed | Expired Token
 *          501:
 *              description: Not Implemented
 */

router.get("/profile", checkAuth,(req,res,next) => {
        res.status(200).json({
            message: req.userData,
            name: user.firstName,
        })
});

/**
 * @swagger
 * tags:
 *  name: User Login
 *  description: This is for the User Login
 * /users/login:
 *  post:
 *      tags: [User Login]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              default: jason@gmail.com
 *                          password:
 *                              type: string
 *                              default: Password
 *      responses:
 *          200:
 *              description: Authorization Successful | Welcome
 *          401:
 *              description: No user found with that email
 *          501:
 *              description: Not Implemented
 */

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
                    name: user.firstName,
                    email: email,
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

/**
 * @swagger
 * tags:
 *  name: User Signup
 *  description: This is for the User Signup
 * /users/signup:
 *  post:
 *      tags: [User Signup]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          firstName:
 *                              type: string
 *                              default: Jason
 *                          lastName:
 *                              type: string
 *                              default: Azevedo
 *                          address:
 *                              type: string
 *                              default: 10 Main Street
 *                          city:
 *                              type: string
 *                              default: Houston
 *                          state:
 *                              type: string
 *                              default: TX
 *                          zip:          
 *                              type: string
 *                              default: 30243
 *                          email:
 *                              type: string
 *                              default: jason@gmail.com
 *                          password:
 *                              type: string
 *                              default: Password
 *      responses:
 *          200:
 *              description: User Signed Up
 *          409:
 *              description: User Already Exists
 *          501:
 *              description: Not Implemented
 */

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
            user.firstName = req.body.firstName
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
            
            res.status(200).json({
                message: "User Signed Up",
                User: {
                    firstName: user.firstName,
                    email: result.email,
                    password: req.body.password,
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