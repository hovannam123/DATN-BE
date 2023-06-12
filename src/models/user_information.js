'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserInformation.belongsTo(models.User, { foreignKey: 'user_id' })
    }
  }
  UserInformation.init({
    user_id: DataTypes.BIGINT,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    birthday: DataTypes.DATE,
    user_image: DataTypes.STRING
  }, {
    sequelize,
    freezeTableName: true,
    modelName: "UserInformation",
    tableName: "user_information",
  });
  return UserInformation;
};