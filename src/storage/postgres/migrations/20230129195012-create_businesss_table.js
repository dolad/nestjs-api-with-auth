'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('businessTypes',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,

        },
      }
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('businessTypes');

  }
};
