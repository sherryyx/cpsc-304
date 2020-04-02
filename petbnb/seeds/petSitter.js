var faker = require('faker');

const createPetSitter = (knex, id) => {
  return knex.raw(`INSERT INTO petsitter (phonenumber, name, bio, housenumber, street, postalcode)
  VALUES (
    '${faker.phone.phoneNumber()}',
    '${faker.name.findName()}',
    '${faker.random.arrayElement(["I am an animal-lover with 3 of my own dogs", "Cat-lover, committed to providing the best care to your pets", "Full-time care and walks on the beach :) "])}',
    ${faker.random.number({min: 100, max: 9999})},
    '${faker.address.streetName()}',
    '${faker.address.zipCode()}'
  ) returning user_id;`);
}

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw(`DELETE FROM petSitter;`)
    .then(function () {
      let records = [];

      for (let i = 1; i <= 35; i++) {
        records.push(createPetSitter(knex, i))
      }

      return Promise.all(records);
    });
};
