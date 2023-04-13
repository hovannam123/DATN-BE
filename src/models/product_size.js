'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductSize extends Model {
    static associate(models) {
      ProductSize.belongsTo(models.Size, { foreignKey: "size_id" }),
        ProductSize.belongsTo(models.Product, { foreignKey: "product_id" })
    }
  }
  ProductSize.init({
    size_id: DataTypes.BIGINT,
    product_id: DataTypes.BIGINT,
    amount: DataTypes.BIGINT,
  }, {
    sequelize,
    freezeTableName: true,
    tableName: "ProductSize"
  });
  return ProductSize;
};