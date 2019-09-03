const express = require('express');
const db = require('./data/db.js');
const server = express();
server.use(express.json());

server.post('/api/posts', (req, res) => {
    const {title, contents} = req.body;

    if (!title || !contents) {
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
    } else {
        db.insert(req.body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(() => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    }
});

server.get('/api/posts', (req,res) => {
    db.find()
        .then(posts => {
            res.json(posts);
        })
        .catch(() => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
});

server.get('/api/posts/:id', (req, res) => {
    const {postsid} = req.params;

    db.findById(postsid)
        .then(post => {
            if (post) {
                res.status(200).json(post); 
            } else {
                res.status(404).json({message: 'The post with the specified ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ message: "The post's information could not be retrieved." });
        });
});

server.get('/api/posts/:id/comments', (req, res) => {
    const {postscommentid} = req.params;

    db.findById(id)
        .then(post => {
            if (post.length) {
                db.findPostComments(postscommentid)
                    .then(comment => {
                        res.status(200).json(comment);
                    })
                    .catch(error => {
                        res.status(500).json({ error: error, message: "The post's comments could not be retrieved." });
                    });
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist.' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error, message: 'The posts information could not be retrieved.' });
        });
});

const port = 5000;
server.listen(port, ()=> console.log(`\n API on http://localhost:${port} \n`));