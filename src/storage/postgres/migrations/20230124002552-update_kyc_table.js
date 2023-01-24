'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
     await queryInterface.removeColumn('kycs', 'businessCountry')
     await queryInterface.addColumn('kycs', 'businessCountry', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
     } )
    
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
