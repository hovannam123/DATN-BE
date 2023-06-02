'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bill extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Bill.belongsTo(models.User, { foreignKey: "user_id" })
            Bill.hasMany(models.BillItem, { foreignKey: "bill_id" })
            Bill.hasOne(models.Payment, { foreignKey: "bill_id" })
        }
    }
    Bill.init({
        user_id: DataTypes.BIGINT,
        total_origin: DataTypes.DECIMAL(15, 2),
        total_voucher: DataTypes.DECIMAL(10, 2),
        total_payment: DataTypes.DECIMAL(15, 2),
        status: DataTypes.STRING
    }, {
        sequelize,
        freezeTableName: true,
        tableName: "bill",
        modelName: "Bill"
    });
    return Bill;
};