const express= require('express');
const server = express();

// const morgan = require('morgan')
// server.use(morgan('combined'))

server.get("/", (req, res) =>{
    console.log("Responding to root router")
    res.send("Router is working")
    res.end()
});

//accessing post routes
const posts = require('./backend/posts')
server.use(posts)

//accessing user routes
const user = require('./backend/user')
server.use(user)

server.listen(3003,() =>{
console.log('Server running on port 3003')
});