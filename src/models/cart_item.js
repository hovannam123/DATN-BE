'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CartItem extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CartItem.belongsTo(models.User, { foreignKey: "user_id", as: "user" })
            CartItem.belongsTo(models.ProductSize, { foreignKey: "product_size_id", as: "product_size" })
        }
    }
    CartItem.init({
        product_size_id: DataTypes.BIGINT,
        quantity: DataTypes.BIGINT,
        total: DataTypes.DECIMAL(15, 2),
        note: DataTypes.STRING,
        user_id: DataTypes.BIGINT
    }, {
        sequelize,
        freezeTableName: true,
        tableName: "cart_item",
        modelName: "CartItem"
    });
    return CartItem;
};