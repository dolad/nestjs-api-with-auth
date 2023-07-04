'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('partners', 'aboutBank', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('partners', 'fundingRequirement', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null
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
