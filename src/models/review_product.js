'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ReviewProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ReviewProduct.belongsTo(models.User, { foreignKey: "user_id" })
            ReviewProduct.belongsTo(models.Product, { foreignKey: "product_id" })
        }
    }
    ReviewProduct.init({
        user_id: DataTypes.BIGINT,
        product_id: DataTypes.BIGINT,
        content: DataTypes.STRING,
    }, {
        sequelize,
        freezeTableName: true,
        tableName: "review_product",
        modelName: "ReviewProduct"
    });
    return ReviewProduct;
};