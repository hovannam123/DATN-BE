'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('voucher_product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      voucher_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "Voucher",
          key: "id",
        },
      },
      product_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "Product",
          key: "id",
        },
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
    await queryInterface.dropTable('voucher_product');
  }
};