'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('businessEntities', 'business_owner', {
      type: Sequelize.STRING,
      allowNull: false
     });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('businessEntities', 'business_owner');
  }
};
