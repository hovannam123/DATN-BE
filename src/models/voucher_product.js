'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class VoucherProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            VoucherProduct.belongsTo(models.Voucher, { foreignKey: "voucher_id" })
            VoucherProduct.belongsTo(models.Product, { foreignKey: "product_id" })
        }
    }
    VoucherProduct.init({
        voucher_id: DataTypes.BIGINT,
        product_id: DataTypes.BIGINT,
    }, {
        sequelize,
        freezeTableName: true,
        modelName: "VoucherProduct",
        tableName: "voucher_product"
    });
    return VoucherProduct;
};