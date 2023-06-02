'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bill', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "user",
          key: "id",
        },
      },
      total_origin: {
        allowNull: false,
        type: Sequelize.DECIMAL(15, 2)
      },
      total_voucher: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2)
      },
      total_payment: {
        allowNull: false,
        type: Sequelize.DECIMAL(15, 2)
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "PENDING"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bill');
  }
};