const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;



// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({
  helpers,
});

const sess = {
  secret: 'grandmas cookie recipe', //used to sign the session ID cookie, a key used for signing and/or encrypting cookies set by the application to maintain session state.
  cookie: {},
  resave: false,//if your store uses the touch method this is false
  saveUninitialized: true, //saves new but not modified session to the store
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// middleware to tell express what template engine it's using
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize
  .sync({
    force: false,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log('Now listening: http://localhost:' + PORT)
    );
  });
