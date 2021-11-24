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
          attributes: ['name'],
        },
        {
          model: Comment,
          attributes: ['comment_id,description, date, user_id, post_id']
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
router.get('/user/:id', async (req, res) => {
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    try {
      const userData = await User.findByPk(req.params.id, {
        include: [{
          model: Post,
          attributes: ['post_id, title, description'],
        }, {
          model: Comment,
          attributes: ['post_id, description, user_id, date, comment_id'],
        }],
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
          model: Post
        },
        {
          model: Comment
        }

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

// //Get books by Genre
// router.get('/genres', withAuth, async (req, res) => {
//   try {
//     const genreData = await Book.findAll({
//       order: [
//         ['genre', 'ASC']
//       ],
//     });

//     const books = genreData.map((book) =>
//       book.get({
//         plain: true,
//       })
//     );

//     for (let i = 0; i < books.length; i++) {
//       let book = books[i];
//       let googleBook = await getBookByISBN(book.isbn);
//       book.image = googleBook.data.items[0].volumeInfo.imageLinks.thumbnail;
//     }

//     res.render('booklist', {
//       books,
//       logged_in: req.session.logged_in,
//     });
//   } catch {
//     res.status(500).json(err);
//   }
// });

// //Get books by Author
// router.get('/authors', withAuth, async (req, res) => {
//   try {
//     const authorData = await Book.findAll({
//       // where: {
//       //   author: 1,
//       // },
//       order: [
//         ['author', 'ASC']
//       ],
//     });

//     const books = authorData.map((book) =>
//       book.get({
//         plain: true,
//       })
//     );

//     for (let i = 0; i < books.length; i++) {
//       let book = books[i];
//       let googleBook = await getBookByISBN(book.isbn);
//       book.image = googleBook.data.items[0].volumeInfo.imageLinks.thumbnail;
//     }

//     res.render('booklist', {
//       books,
//       logged_in: req.session.logged_in,
//     });
//   } catch {
//     res.status(500).json(err);
//   }
// });



////////////////////////////

// router.get('/profile', async (req, res) => {
//   try {
//  bookRoutes
//     if (req.session.loggedIn) {
//       res.render('profile');
//     }

//     res.render('login');

//     const bookData = await Book.findbyPK(req.params.id);
//     const book = bookData.get({
//       plain: true,
//     });

//     const googleBook = await getBookByISBN(book.isbn)
//     res.render('book', {
//       book,
//       loggedIn: req.session.loggedIn,

//     });
//  main
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //Get one book
// router.get('/book/:id', withAuth, async (req, res) => {
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

// // Use withAuth middleware to prevent access to route
// router.get('/profile', withAuth, async (req, res) => {
//   try {
//     // Find the logged in user based on the session ID
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: Project }],
//     });

//     const user = userData.get({ plain: true });

//     res.render('profile', {
//       ...user,
//       logged_in: true
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//Login route
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

module.exports = router;