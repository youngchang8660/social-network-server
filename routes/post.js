const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const Post = mongoose.model('post');
const User = mongoose.model('user');

//create a post
router.post('/create', authMiddleware, async(req, res) => {
    const { title, body, photo } = req.body;
    const user = await User.findById(req.user).select("-password");
    console.log(user)
    try {
        if(!title || !body) {
            res.status(422).json({error: 'Add all the fields'});
        }
        const newPost = new Post({
            title,
            body,
            photo,
            author: user
        })
        const post = await newPost.save();
        res.json({post})
    } catch(err) {
        console.log(err);
        res.status(500).send('Server error');
    }
})

//view all posts
router.get('/getAllPosts', async (req, res) => {
    try {
        const posts = await Post.find().sort({date: -1}).populate('author', '_id name');
        // console.log(posts)
        res.json(posts);
    } 
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

//get all of signed in user's post
router.get('/getMyPosts', authMiddleware, async(req,res) => {
    // const posts = await Post.find();
    try {
        const user = await User.findById(req.user).select("-password");
        const myPost = await Post.find({author: user._id})
        res.json(myPost);
    } catch(err) {
        console.log(err);
        res.status(500).send('Server error');
    }
})

//get Specific user's posts
router.get('/someonesPosts', authMiddleware, async(req,res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        const myPost = await Post.find({author: user._id})
        res.json(myPost);
    } catch(err) {
        console.log(err);
        res.status(500).send('Server error');
    } 
})

module.exports = router