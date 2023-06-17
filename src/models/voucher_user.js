'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class VoucherUser extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            VoucherUser.belongsTo(models.Voucher, { foreignKey: "voucher_id" })
            VoucherUser.belongsTo(models.User, { foreignKey: "user_id" })
        }
    }
    VoucherUser.init({
        voucher_id: DataTypes.BIGINT,
        user_id: DataTypes.BIGINT,
    }, {
        sequelize,
        freezeTableName: true,
        modelName: "VoucherUser",
        tableName: "voucher_user"
    });
    return VoucherUser;
};