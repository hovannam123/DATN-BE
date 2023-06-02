'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bill_item', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      bill_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "bill",
          key: "id",
        },
      },
      product_size_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "product_size",
          key: "id",
        },
      },
      quantity: {
        allowNull: false,
        type: Sequelize.BIGINT,
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
    await queryInterface.dropTable('bill_item');
  }
};