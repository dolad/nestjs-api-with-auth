'use strict';

const faker = require('faker');

const testUser = () => {
  return {
    id: faker.datatype.uuid(),
    firstName: faker.datatype.userName(),
    lastName: faker.datatype.userName(),
    email: "test@rectpath.com",
    password: "e3274be5c857fb42ab72d786e281b4b8", //adminpassword
    phone:  '0712345679',
    username: 'testUser',
    userType: 'student'
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('users', [testUser()], {});

  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('users', null, {});
  }
};
