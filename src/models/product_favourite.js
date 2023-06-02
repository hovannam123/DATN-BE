'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductFavourite extends Model {
    static associate(models) {
      ProductFavourite.belongsTo(models.User, { foreignKey: "user_id" }),
        ProductFavourite.belongsTo(models.Product, { foreignKey: "product_id" })
    }
  }
  ProductFavourite.init({
    user_id: DataTypes.BIGINT,
    product_id: DataTypes.BIGINT,
  }, {
    sequelize,
    freezeTableName: true,
    modelName: "ProductFavourite",
    tableName: 'product_favourite'

  });
  return ProductFavourite;
};