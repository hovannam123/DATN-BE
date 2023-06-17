'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Voucher extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Voucher.hasMany(models.VoucherUser, { foreignKey: "voucher_id" })
        }
    }
    Voucher.init({
        value_percent: DataTypes.DOUBLE,
        start_at: DataTypes.STRING,
        end_at: DataTypes.DATE,
    }, {
        sequelize,
        freezeTableName: true,
        modelName: "Voucher",
        tableName: "voucher"
    });
    return Voucher;
};