require('dotenv').config();
const express = require('express');

console.log('environment:', process.env.NODE_ENV);

const postsRoutes = require("./posts/router.js");
const server = express();

server.use(express.json());
server.use("/api/posts", postsRoutes);

const port = process.env.PORT || 5000;
server.listen(port, ()=> console.log(`\n API on http://localhost:${port} \n`));