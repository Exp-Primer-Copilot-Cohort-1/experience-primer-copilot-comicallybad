// Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var User = require('../models/user');
var Post = require('../models/post');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

// Get all comments
router.get('/', function(req, res) {
    Comment.find(function(err, comments) {
        if (err) {
            res.send(err);
        }
        res.json(comments);
    });
});

// Get all comments for a specific post
router.get('/post/:post_id', function(req, res) {
    Comment.find({post_id: req.params.post_id}, function(err, comments) {
        if (err) {
            res.send(err);
        }
        res.json(comments);
    });
});

// Get a specific comment
router.get('/:comment_id', function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) {
            res.send(err);
        }
        res.json(comment);
    });
});

// Create a comment
router.post('/', function(req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        // Verify token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // Create comment
                var comment = new Comment();
                comment.post_id = req.body.post_id;
                comment.author = req.body.author;
                comment.comment = req.body.comment;
                comment.save(function(err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({message: 'Comment created!'});
                });
            }
        });
    } else {
        // Return error if no token provided
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// Update a specific comment
router.put('/:comment_id', function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) {
            res.send(err);
        }
        // Update comment info
        comment.post_id = req.body.post_id;
        comment.author = req.body.author;
        comment.comment = req.body.comment;
        comment.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Comment updated!'});
        });
    });
});

// Delete a specific comment
router.delete('/:comment_id', function(req, res) {
    Comment.remove({_id: req.params.comment_id}, function(err, comment) {
        if (err) {
            res.send(err);
        }
        res.json({message: 'Comment deleted!'});
    });
});

module.exports = router;