'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('size', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      size_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      weigh: {
        allowNull: false,
        type: Sequelize.STRING
      },
      height: {
        allowNull: false,
        type: Sequelize.STRING
      },
      delete_flag: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('size');
  }
};