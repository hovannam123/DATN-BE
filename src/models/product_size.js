'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductSize extends Model {
    static associate(models) {
      ProductSize.belongsTo(models.Product, { foreignKey: "product_id" });
      ProductSize.belongsTo(models.Size, { foreignKey: "size_id" });
      ProductSize.hasMany(models.CartItem, { foreignKey: "product_size_id" });
      ProductSize.hasOne(models.BillItem, { foreignKey: "product_size_id" });
    }
  }
  ProductSize.init({
    size_id: DataTypes.BIGINT,
    product_id: DataTypes.BIGINT,
    amount: DataTypes.BIGINT,
  }, {
    sequelize,
    freezeTableName: true,
    modelName: "ProductSize",
    tableName: 'product_size'
  });
  return ProductSize;
};