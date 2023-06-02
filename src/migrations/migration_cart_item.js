'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cart_item', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
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
        type: Sequelize.BIGINT
      },
      total: {
        allowNull: false,
        type: Sequelize.DECIMAL(15, 2),
      },
      note: {
        type: Sequelize.STRING
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "User",
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
    }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cart_item');
  }
};