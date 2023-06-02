'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: "role_id" })
    }
  }
  Role.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    freezeTableName: true,
    modelName: "Role",
    tableName: "role"
  });
  return Role;
};