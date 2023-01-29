
'use strict';


const {faker} = require('@faker-js/faker');



const businessArray =  [
  "Business 2 Consumer",
  "Business 2 Business",
  "FMCG",
  "Telecom",
  "Technology",
  "Business 2 Government",
  "Consumer 2 Consumer",
  "Furniture",
  "Luxury",
  "Consumer 2 Government",
  "Fashion and Apparel",
  "Health and Beauty"
]

const mapDb = businessArray.map(item => {
  return {
    id: faker.datatype.uuid(),
    name: item,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
} )

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("businessTypes", mapDb, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('businessTypes', null, {});

  }
};
