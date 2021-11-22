const withAuthorization = (req, res, next) => {
  // redirect user to login page if they try to click on anything but aren't logged in
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = withAuthorization;
