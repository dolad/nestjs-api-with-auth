'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
     await queryInterface.addColumn('users', 'IsGoogleSign', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
     } )
    
  },

  async down (queryInterface, Sequelize) {
    
     await queryInterface.dropTable('users');
     
  }
};
