'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('businessEntities', 'business_owner',);
     await queryInterface.addColumn('businessEntities', 'businessOwner', {
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
