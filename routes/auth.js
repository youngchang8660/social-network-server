const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
    res.send('hello this is home page');
})

//getAllUsers
router.get('/getAllUsers', async(req,res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(err) {
        console.log(err);
        res.status(500).send('Server error');
    }
})

//register
router.post('/signup', async (req, res)=> {
    const {name, email, password} = req.body
    if(!name || !email || !password) {
        return res.status(400).json({error: 'Fill all the items'});
    }
    try {
        const existingEmail = await User.findOne({email});
        if(existingEmail) {
            return res.status(400).json("This email already exists");
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const newUser = new User({
            name,
            email,
            password: hash
        })
        await newUser.save();
        res.json("Successfully registered")
    }

    catch(err) {
        console.log(err);
        res.status(500).send('Server error');
    }
})

//login
router.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json('Incorrect email');
        }
        let authorized = bcrypt.compareSync(password, user.password);
        if(!authorized) {
            return res.status(401).json('Incorrect password')
        }
        //jwt token
        const payload = {
            user: {
                _id: user.id,
                _email: user.email,
                _name: user.name
            }
        }
        const token = jwt.sign(payload, JWT_SECRET);
        res.json({token});
    }
    catch(err) {
        console.log(err);
        res.status(500).send('Server error');
    }
})

//login with authorized token
router.get('/login', authMiddleware, (req, res) => {
    res.send(req.user);
})

//logout


module.exports = router