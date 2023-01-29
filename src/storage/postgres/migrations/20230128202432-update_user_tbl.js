'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'IsGoogleSign')
    await queryInterface.addColumn('users', 'isGoogleSign', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
     } )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'isGoogleSign')
  }
};
