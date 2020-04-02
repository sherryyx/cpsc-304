var faker = require('faker');

const createPetSitter = (knex) => {
  return knex.raw(`INSERT INTO petsitter (phonenumber, name, bio, housenumber, street, postalcode)
  VALUES (
    '${faker.phone.phoneNumber()}',
    '${faker.name.findName().replace("'", "''")}',
    '${faker.random.arrayElement(["I am an animal-lover with 3 of my own dogs", "Cat-lover, committed to providing the best care to your pets", "Full-time care and walks on the beach :) "])}',
    ${faker.random.number({min: 100, max: 9999})},
    '${faker.address.streetName().replace("'", "''")}',
    '${faker.address.zipCode()}'
  ) returning user_id;`).then(({rows}) => {
    const sitter_id = rows[0].user_id;

    return createService(knex, sitter_id);
  });
}

const createService = (knex, sitter_id) => {
    return knex.raw(`INSERT INTO service (pricePer, user_id, serviceType)
    VALUES (
        '${faker.finance.amount(12, 60, 2)}',
        '${sitter_id}',
        '${faker.random.arrayElement(["pet boarding", "pet walking", "drop in visit"])}'
    )`);
}


exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw(`DELETE FROM petSitter; DELETE FROM service;`)
    .then(function () {
      let records = [];

      for (let i = 1; i <= 35; i++) {
        records.push(createPetSitter(knex))
      }

      return Promise.all(records);
    });
};
