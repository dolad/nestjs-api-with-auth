'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('financialConnect', {
       id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey:true
       },
       customerEmail:{
        type: Sequelize.STRING,
        allowNull: false,
       },
       customerId:{
        type: Sequelize.STRING,
        allowNull: false,
       },
       saltEdgeCustomerId:{
        type: Sequelize.STRING,
        allowNull: false,
       },
       saltEdgeIdentifier: {
        type: Sequelize.STRING,
        allowNull: false,
       },
       saltCustomerSecret: {
        type: Sequelize.STRING,
        allowNull: false,
       },
       businessId: {
        type: Sequelize.STRING,
        allowNull: false,
       }


    })
  
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('financialConnect')
  }
};
