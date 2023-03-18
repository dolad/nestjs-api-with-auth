'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('softwareConnects', 'publicToken');
    await queryInterface.addColumn('softwareConnects', 'accessToken', {
      type: Sequelize.STRING,
      allowNull: false
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
