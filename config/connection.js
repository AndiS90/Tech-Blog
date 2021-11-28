const Sequelize = require('sequelize'); 
require('dotenv').config();//allows for hiding personal information within the code

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);//jawsdb allows for heroku integration
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME, //hidden info thanks dotenv
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    }
  );
}

module.exports = sequelize;



// another code for connection
// const Sequelize = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: 'localhost',
//     dialect: 'mysql',
//     port: 3306,
//   }
// );

// module.exports = sequelize;
