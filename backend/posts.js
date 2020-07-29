// contains all posts related end point
const express = require('express')
const posts = express.Router()
const bodyParser = require('body-parser')
posts.use(bodyParser.json())

const morgan = require('morgan')
posts.use(morgan('combined'))

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/meanappdb')
.then(() =>{
    console.log('Database Connection successful') 
})
.catch(() =>{
    console.log('Database Connection Failed!')
})

const checkAuth = require('./middleware/check-auth');

const Post = require('./models/post')

posts.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, DELETE, POST, PATCH, PUT, OPTIONS'
    );
    next();
})

posts.post('/posts',checkAuth, (req,res) =>{
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.UserId
    });
    console.log(req.userData)
    return res.status(200).json({});
    post.save().then(createdPost =>{
        res.status(201).json({
            message:'Post Created successfully',
            postId: createdPost._id
        })
    })
})

posts.get('/posts',(req,res) =>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.then(documents => {
        fetchedPosts = documents
        return Post.count();
    }).then(count => {
        //console.log(documents)
        res.status(200).json({
            Currentposts: fetchedPosts,
            maxPosts: count
        });
    })
})

posts.get('/posts/:_id',(req, res, next) =>{
    Post.findById(req.params._id)
    .then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found'})
        }
    })
})

posts.put('/posts/:_id',checkAuth, (req, res, next) =>{
    const post = new Post({
        _id: req.body._id,
        title: req.body.title,
        content: req.body.content
    })
    Post.updateOne({_id: req.params._id}, post)
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Post update successful'
        })
    })
})

posts.delete('/posts/:_id', checkAuth, (req, res, next) =>{
    const  id = req.params._id;
    console.log(id)
    Post.findByIdAndRemove(id).then(result => {
         console.log(result)
         res.status(200).json({
             message: 'Post successfully deleted'
         });
    }).catch(err =>{
        console.log(err)
    });
})

module.exports = posts;