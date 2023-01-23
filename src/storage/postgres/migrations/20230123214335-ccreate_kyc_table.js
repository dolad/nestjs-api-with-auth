'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('kyc', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    employmentStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      annualIncome: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      personalCreditLimit: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      residentialAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      residentialPostcode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      kycStep: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      businessAddress: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      businessPostcode: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      businessCountry: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      businessCity: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      bank: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      userId:{
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
     }  
    );
  },

  async down (queryInterface, Sequelize) {
    
     await queryInterface.dropTable('kyc');

  }
};
