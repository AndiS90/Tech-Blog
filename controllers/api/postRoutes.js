const router = require('express').Router();
const {
  Post
} = require('../../models');
const withAuthorization = require('../../utils/auth');


//create new post at /posts if logged in/authorized
router.post('/', withAuthorization, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      description: req.body.description,
      user_id: req.session.user_id, //sets the user_id of the post to the id of the logged in user
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// route to get all posts
router.get('/', withAuthorization, async (req, res) => {
  const postData = await Post.findAll().catch((err) => {
    res.json(err);
  });
  const posts = postData.map((post) => post.get({
    plain: true
  }));
  res.render('all', {
    posts
  });
});

//get one book by id
// router.get('/:id', withAuth, async (req, res) => {
//   try {
//     const bookData = await Book.findbyPK(req.params.id);
//     const book = bookData.get({
//       plain: true,
//     });
//     res.render('book', {
//       book,
//       loggedIn: req.session.loggedIn,
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// update a post at posts/post_id
router.put("/:post_id", withAuthorization, async (req, res) => {
  try {
    const postData = await Post.update({
      title: req.body.title,
      description: req.body.description,
    }, {
      where: {
        post_id: req.params.post_id,
        // user_id: req.session.user_id,
      },
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json;
  }
});

//delete post at /posts/post_id
router.delete('/:post_id', withAuthorization, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        post_id: req.params.post_id,
        // user_id: req.session.user_id
      },
    });

    if (!postData) { //if post data is inconsistent
      res.status(404).json({
        message: 'No post found with this title!'
      });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;