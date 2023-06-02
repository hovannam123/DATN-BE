'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Payment.belongsTo(models.Bill, { foreignKey: "bill_id" })
        }
    }
    Payment.init({
        bill_id: DataTypes.BIGINT,
        payment_infor: DataTypes.STRING
    }, {
        sequelize,
        freezeTableName: true,
        tableName: "payment",
        modelName: "Payment"
    });
    return Payment;
};