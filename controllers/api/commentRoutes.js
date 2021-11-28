const router = require('express').Router();
const {
    Comment
} = require('../../models');
const withAuthorization = require('../../utils/auth');


//create new comment at /comments if logged in/authorized
router.post('/', withAuthorization, async (req, res) => {
    try {
        const newComment = await Comment.create({
            post_id: req.body.post_id, //(data-type attribute to send it back)
            description: req.body.description,
            user_id: req.session.id, //sets the user_id of the post to the id of the logged in user
        });

        res.status(200).json(newComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

// route to get all comments at /comments
router.get('/', withAuthorization, async (req, res) => {
    const commentsData = await Comment.findAll().catch((err) => {
        res.json(err);
    });
    const comments = commentsData.map((comment) => comment.get({
        plain: true
    }));
    res.render('all', {
        comments
    });
});

//get comments by post_id at comments/post_id
router.get('/:post_id', withAuthorization, async (req, res) => {
    try {
        const commentsData = await Comment.findbyPK(req.params.post_id);
        const comments = commentsData.get({
            plain: true,
        });
        res.render('comment-details', {
            comments,
            // logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


// update a comment at comments/comment_id 
router.put("/:comment_id", withAuthorization, async (req, res) => {
    try {
        const commentData = await Comment.update({
            description: req.body.description,
        }, {
            where: {
                comment_id: req.params.comment_id,
                user_id: req.session.id,
            },
        });
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json;
    }
});



//delete post at /comments/comment_id
router.delete('/:comment_id', withAuthorization, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                comment_id: req.params.comment_id,
                user_id: req.session.user_id,
            },
        });

        if (!commentData) { //if comment data is inconsistent
            res.status(404).json({
                message: 'No comment found here!'
            });
            return;
        }

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;