var faker = require('faker');

let createRecord = (knex, id) => {
  return knex.raw(`INSERT INTO petOwner
  VALUES (
    ${id},
    '${faker.phone.phoneNumber()}',
    '${faker.name.findName()}',
    ${faker.random.number({min: 100, max: 9999})},
    '${faker.address.streetName()}',
    '${faker.address.zipCode()}'
  );`)
}

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw(`DELETE FROM petOwner`)
    .then(function () {
      let records = [];

      for (let i = 1; i <= 20; i++) {
        records.push(createRecord(knex, i))
      }

      return Promise.all(records);
    });
};
