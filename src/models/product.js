'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: "category_id" });
      Product.hasMany(models.ProductSize, {
        foreignKey: "product_id",
        as: "size_data"
      });
      Product.hasMany(models.ProductFavourite, { foreignKey: "product_id" });
      Product.hasMany(models.ReviewProduct, { foreignKey: "product_id" })
      Product.hasMany(models.ProductImage, { foreignKey: "product_id" })
    }
  }
  Product.init({
    category_id: DataTypes.BIGINT,
    name: DataTypes.STRING,
    image_origin: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    status: DataTypes.BOOLEAN,
    delete_flag: DataTypes.BOOLEAN
  }, {
    sequelize,
    freezeTableName: true,
    modelName: "Product",
    tableName: "product",
  });
  return Product;
};