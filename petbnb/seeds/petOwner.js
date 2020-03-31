var faker = require('faker');

const createPet = (knex, pet_id, owner_id) => {
  return knex.raw(`INSERT INTO pet
  VALUES(
    ${pet_id},
    '${faker.name.firstName()}',
    'Play fetch twice an hour',
    'Feed chimken twice a day please',
    ${faker.random.number(18)},
    '${faker.random.arrayElement(["Chihuahua", "Domestic Short Hair Cat", "Husky", "Hairless Cat", "Labradoodle"])}',
    ${faker.finance.amount(5, 20, 1)},
    ${owner_id}
  );`);
}

const createPetOwner = (knex, id) => {
  return knex.raw(`INSERT INTO petOwner
  VALUES (
    ${id},
    '${faker.phone.phoneNumber()}',
    '${faker.name.findName()}',
    ${faker.random.number({min: 100, max: 9999})},
    '${faker.address.streetName()}',
    '${faker.address.zipCode()}'
  );`).then(() => {
    let records = [];

    for (let pet_id = 2*id; pet_id <= 2*id+1; pet_id++) {
      records.push(createPet(knex, pet_id, id));
    }

    return Promise.all(records);
  });
}

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw(`DELETE FROM petOwner; DELETE FROM pet;`)
    .then(function () {
      let records = [];

      for (let i = 1; i <= 20; i++) {
        records.push(createPetOwner(knex, i))
      }

      return Promise.all(records);
    });
};
