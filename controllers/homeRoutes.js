const router = require('express').Router();
const {
  Post,
  Comment,
  User
} = require('../models');
const withAuthorization = require('../utils/auth');
//requires in helper function to require login confirmation before viewing



// Get route for sending all posts and comments for homepage
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{
          model: User,
          // attributes: ['name'],

        },
        {
          model: Comment,
          // attributes: 
          include: [{
            model: User,
            attributes: ['name'],
          }, ]

        }
      ]
    });

    // Serialize data so the template can read it across each individual piece of daata
    const posts = postData.map((post) =>
      post.get({
        plain: true,
      })
    );

    // Pass serialized data of users and a potential session flag into template w express render
    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in,
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

//Get one user
router.get('/users/:id', async (req, res) => {
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    try {
      const userData = await User.findByPk(req.params.id, {
        include: [{
          model: Post,
          include: [{
            model: Comment,
            // attributes: 
            include: [{
              model: User,
              attributes: ['name'],
            }, ]

          }],
        }]
      });
      const user = userData.get({
        plain: true,
      });



      res.render('user', {
        ...user,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

// Use withAuthorization custom middleware to prevent access to route unless the user is logged in
router.get('/dashboard', withAuthorization, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: {
        exclude: ['password'], // hey hey don't send out user passwords
      },
      include: [{
          model: Post,
          include: [{
            model: Comment,
            // attributes: 
            include: [{
              model: User,
              attributes: ['name'],
            }, ]

          }]

        },
        // {
        //   model: Comment
        // }

      ],
    });

    const user = userData.get({
      plain: true,
    });

    res.render('dashboard', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});



//Get one post
router.get('/posts/:post_id', async (req, res) => {
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    try {
      const postData = await Post.findByPk(req.params.post_id, {
        // include: [{
        //   model: User,
        include: [{
          model: Comment,
          // attributes: 
          include: [{
            model: User,
            attributes: ['name'],
          }, ]

        }],

      })
      const post = postData.get({
        plain: true,
      });



      res.render('postbyid', {
        ...post,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});


//Login route
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

module.exports = router;