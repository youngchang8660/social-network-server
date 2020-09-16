const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../db');
// const { payload } = require('../routes/auth');

// const mongoose = require('mongoose');
// const User = mongoose.model('user');

module.exports = (req, res, next) => {
    const token = req.header('token');

    //check if no token
    if(!token) {
        return res.status(401).json('No token, authorization denied');
    }
    
    //verify
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).send('Token is not valid')
        console.log(err)
    }
}