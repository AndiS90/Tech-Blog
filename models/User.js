const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}
//crypting factoid:
// with "salt round" they actually mean the cost factor. 
// The cost factor controls how much time is needed to calculate a single BCrypt hash. 
// The higher the cost factor, the more hashing rounds are done. 
// Increasing the cost factor by 1 doubles the necessary time.

User.init(
  {
    id: {
      type: DataTypes.INTEGER, //kinda hard to expand on these objects and values, they're pretty self explanatory
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {   //model validations specify format/content/inheritance values for each attribute
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    }
  
  },
  { //arguments to hooks can change the values, and this will be reflected in the insert / update statement. 
    //A hook may contain async actions - and should return a promise.
    hooks: {
      beforeCreate: async (newUser) => {
        newUser.password = await bcrypt.hash(newUser.password, 10);//hashes the new user's pw through 10 'saltrounds'
        return newUser;//returns full object with pw hashed
      },
      beforeUpdate: async (updatedUser) => {
        updatedUser.password = await bcrypt.hash(updatedUser.password, 10);//see above
        return updatedUser;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true, // Model tableName will be the same as the model name // DiSaBLES the modification of table names; By default, sequelize will automatically transform all passed MODAL NAMES (first parameter of define) INTO FREAKIN PLURAL FORM. nice.
    underscored: true, // don't use camelcase for automatically added attributes but underscore style --so updatedAt will be updated_at
    modelName: 'user',
  }
);

module.exports = User;
