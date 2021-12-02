const sequelize = require('../config/connection');
//can add back for use with json file
const {
  User,
  Post,
  Comment
} = require('../models');

const userData = require('./userData.json');
const postData = require('./PostData.json');
const commentData = require('./CommentData.json')

const seedDatabase = async () => {
  try {
    await sequelize.sync({
      force: true
    });

    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    for (const post of postData) {
      await Post.create({
        ...post,

      });
    }

    for (const comment of commentData) {
      await Comment.create({
        ...comment,

      });
    }
  } catch (err) {
    console.log(err);
  }

  process.exit(0);
};

seedDatabase();

// const seedDatabase = async () => {
//   await sequelize.sync({ force: true });

//   await seedBooks();

//   await seedUser();

//   process.exit(0);
// };

// seedDatabase();