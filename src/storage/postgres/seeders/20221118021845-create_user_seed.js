'use strict';

const {faker} = require('@faker-js/faker');

const testUser = {
    id: faker.datatype.uuid(),
    firstName: faker.internet.userName(),
    lastName: faker.internet.userName(),
    email: "test@flinke.io",
    password: "e3274be5c857fb42ab72d786e281b4b8", //adminpassword
    userType: 'business',
    isConfirmed: false,
    hasCompletedKYC: false,
    updatedAt: new Date(),
    createdAt: new Date(),
  }

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('users', [testUser], {});

  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('users', null, {});
  }
};
