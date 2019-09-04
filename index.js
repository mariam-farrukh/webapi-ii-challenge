const express = require('express');
const postsRoutes = require("./posts/router.js");
const server = express();

server.use(express.json());
server.use("/api/posts", postsRoutes);

const port = 5000;
server.listen(port, ()=> console.log(`\n API on http://localhost:${port} \n`));