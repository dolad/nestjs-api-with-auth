'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'kycId', {
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      type: Sequelize.UUID,
      references: {
        model: 'kyc',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('users', 'kycId');
    
  }
};
