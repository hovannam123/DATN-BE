'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: "role_id", as: "user_role_data" })
    }
  }
  Role.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    freezeTableName: true,
    tableName: "Role"
  });
  return Role;
};