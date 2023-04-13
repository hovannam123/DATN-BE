'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_size', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      size_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "Size",
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
      amount: {
        allowNull: false,
        type: Sequelize.BIGINT
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
    await queryInterface.dropTable('product_size');
  }
};