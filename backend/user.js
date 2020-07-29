// contains all user related end point
const express = require('express')
const user = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../backend/models/user")

user.post("/signup", (req, res, next) =>{
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const userCredentials = new User({
            email: req.body.email,
            password: hash
        });
        userCredentials.save()
        .then(result =>{
            res.status(201).json({
                message: 'User created',
                result: result
            });
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
    });
}); 

user.post("/login", (req, res, next) =>{
    let fetchedUser;
    User.findOne({ email: req.body.email})
    .then(user => {
        if (!user) {
           return res.status(401).json({
               message: "Email was not found"
           }) 
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if (!result) {
            return res.status(401).json({
                message: " Invalid password was entered"
            })
        }
        const token = jwt.sign(
            {email: fetchedUser.email, UserId: fetchedUser._id},
            'this-secret-string-is-used-to-validate-our-token',
            { expiresIn: '30min'}
        );
        res.status(200).json({
            token: token,
            expiresIn: 1800
        })
    })
    .catch(err => {
        return res.status(401).json({
            message: "Authentication failed!"
        })
    })
})

module.exports = user;