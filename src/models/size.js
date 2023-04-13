'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    static associate(models) {
      Size.hasMany(models.ProductSize, { foreignKey: "size_id", as: "product_size_data" })
    }
  }
  Size.init({
    size_name: DataTypes.STRING,
    weigh: DataTypes.STRING,
    height: DataTypes.STRING,
  }, {
    sequelize,
    freezeTableName: true,
    modelName: "Size"
  });
  return Size;
};