const express = require("express");
const Posts = require("../data/db.js");
const router = express.Router();

router.post('/', (req, res) => {
    const {title, contents} = req.body;
    
    if (!title || !contents) {
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
    } else {
        Posts.insert(req.body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(() => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    }
});

router.post('/:id/comments', (req, res) => {

    if (req.body.text) {
        Posts.findById(req.params.id)
            .then(post => {
                if (post.length) {
                    Posts.insertComment({ ...req.body, post_id: req.params.id })
                        .then(comment => {
                            res.status(201).json(comment);
                        })
                        .catch(error => {
                            res.status(500).json({ error: error, message: 'The posts information could not be retrieved.' });
                        });
                } else {
                    res.status(404).json({ message: 'The post with the specified ID does not exist.' });
                }
            })
            .catch(() => {
                res.status(500).json({ message: 'The posts information could not be retrieved.' });
            });
    } else {
        res.status(400).json({ errorMessage: 'Please provide text for the comment.' });
    }
});

router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.json(posts);
        })
        .catch(() => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
});

router.get('/:id', (req, res) => {
    const {id} = req.params;
    Posts.findById(id)
        .then(post => {
            console.log(post);
            if (post && post.length > 0) {
                res.status(200).json(post); 
            } else {
                res.status(404).json({message: 'The post with the specified ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ message: "The post's information could not be retrieved." });
        });
});

router.get('/:id/comments', (req, res) => {

    Posts.findById(req.params.id)
        .then(post => {
            if (post.length) {
                Posts.findPostComments(req.params.id)
                    .then(comment => {
                        res.status(200).json(comment);
                    })
                    .catch(() => {
                        res.status(500).json({ message: "The post's comments could not be retrieved." });
                    });
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ message: 'The posts information could not be retrieved.' });
        });
});

router.delete('/:id', (req, res)=> {
    Posts.remove(req.params.id)
    .then(post => {
        if(post){
            res.status(200).json({
                message: "The post was deleted."
            })
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    })
    .catch(()=> {
        res.status(500).json({
            error: "The post could not be removed."
        })
    })
})

router.put('/:id', (req, res)=> {
    const { title, contents} = req.body;
    if(!title || ! contents){
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    } else {
        Posts.update(req.params.id, req.body)
        .then(post => {
            if(post){
                res.status(200).json(req.body)
            } else {
                res.status(404).json({
                    message: "The post withthe specified ID does not exist."
                })
            }
        })
        .catch(()=>{
            res.status(500).json({
                error: "the post information could not be modified."
            })
        })
    }
});

module.exports = router;