'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: "role_id" })
      User.hasOne(models.UserInformation, { foreignKey: "user_id" })
      User.hasMany(models.CartItem, { foreignKey: "user_id", as: "user_data" })
      User.hasMany(models.Bill, { foreignKey: "user_id", as: 'bill_data' })
      User.hasMany(models.ReviewProduct, { foreignKey: "user_id" })
      User.hasMany(models.VoucherUser, { foreignKey: "user_id" });

    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    expired_time: DataTypes.DATE,
    verify_code: DataTypes.STRING,
    role_id: DataTypes.BIGINT,
  }, {
    sequelize,
    freezeTableName: true,
    modelName: "User",
    tableName: "user"
  });
  return User;
};