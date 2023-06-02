'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BillItem extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BillItem.belongsTo(models.Bill, { foreignKey: "bill_id" })
            BillItem.belongsTo(models.ProductSize, { foreignKey: "product_size_id" })
        }
    }
    BillItem.init({
        bill_id: DataTypes.BIGINT,
        product_size_id: DataTypes.BIGINT,
        quantity: DataTypes.BIGINT,
    }, {
        sequelize,
        freezeTableName: true,
        tableName: "bill_item",
        modelName: "BillItem"
    });
    return BillItem;
};