var faker = require('faker');

const createPet = (knex, owner_id) => { 
  return knex.raw(`INSERT INTO pet (name, careinstructions, dietinstructions, age, breed, weight, user_id)
  VALUES(
    '${faker.name.firstName().replace("'", "''")}',
    'Play fetch twice an hour',
    'Feed chimken twice a day please',
    ${faker.random.number(18)},
    '${faker.random.arrayElement(["Chihuahua", "Domestic Short Hair Cat", "Husky", "Hairless Cat", "Labradoodle"])}',
    ${faker.finance.amount(5, 20, 1)},
    ${owner_id}
  ) returning pet_id;`).then(({rows}) => {
    const pet_id = rows[0].pet_id;
    return createPetSitter(knex).then(({rows}) => {
      const sitter_id = rows[0].user_id;

      let records = [];

      records.push(createServiceAndBooking(knex, sitter_id, pet_id, owner_id));
      records.push(createReviews(knex, sitter_id, owner_id));

      return Promise.all(records);
    });
  });  
}

const createPetOwner = (knex, id) => {
  return knex.raw(`INSERT INTO petOwner (phonenumber, name, housenumber, street, postalcode)
  VALUES (
    '${faker.phone.phoneNumber()}',
    '${faker.name.findName().replace("'", "''")}',
    ${faker.random.number({min: 100, max: 9999})},
    '${faker.address.streetName().replace("'", "''")}',
    '${faker.address.zipCode()}'
  ) returning user_id;`).then(({rows}) => {
    let records = [];

    const owner_id = rows[0].user_id;

    for (let i = 0; i < 2; i++) {
      records.push(createPet(knex, owner_id));
    }

    // records.push(createPetSitter(knex, owner_id));

    return Promise.all(records);
  });
}

// Create petSitter, associated services, and reviews
const createPetSitter = (knex) => {
  return knex.raw(`INSERT INTO petsitter (phonenumber, name, bio, housenumber, street, postalcode)
  VALUES (
    '${faker.phone.phoneNumber()}',
    '${faker.name.findName().replace("'", "''")}',
    '${faker.random.arrayElement(["I am an animal-lover with 3 of my own dogs", "Cat-lover, committed to providing the best care to your pets", "Full-time care and walks on the beach :) "])}',
    ${faker.random.number({min: 100, max: 9999})},
    '${faker.address.streetName().replace("'", "''")}',
    '${faker.address.zipCode()}'
  ) returning user_id;`);
}

const createServiceAndBooking = (knex, sitter_id, pet_id, owner_id) => {
    return knex.raw(`INSERT INTO service (pricePer, user_id, serviceType)
    VALUES (
        '${faker.finance.amount(12, 60, 2)}',
        '${sitter_id}',
        '${faker.random.arrayElement(["Pet boarding", "Pet walking", "Drop in visit"])}'
    ) returning service_id;`).then(({rows}) => {
      const service_id = rows[0].service_id;
      return createBooking(knex, service_id, owner_id, pet_id);
    });
}

const createReviews = (knex, sitter_id, owner_id) => {
  return knex.raw(`INSERT INTO review (reviewContent, rating, ownerUser_id, sitterUser_id)
  VALUES (
    '${faker.random.arrayElement(["My dog loved them! Would highly recommend", "My cat enjoyed their time with them"])}',
    '${faker.random.number({min: 3, max: 5})}',
    '${owner_id}',
    '${sitter_id}'
  )`);
}

const createBooking = async (knex, service_id, owner_id, pet_id) => {
  return knex.raw(`INSERT INTO booking (duration, service_id, petowner_id, pet_id)
    VALUES (
      ${faker.random.arrayElement([0.5, 1, 2, 24, 48])},
      ${service_id},
      ${owner_id},
      ${pet_id}
    )`);
}

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw(`DELETE FROM petOwner; DELETE FROM pet; DELETE FROM petSitter; DELETE FROM service; DELETE FROM review; DELETE FROM booking;`)
    .then(function () {
      let records = [];

      for (let i = 1; i <= 35; i++) {
        records.push(createPetOwner(knex, i))
      }

      return Promise.all(records);
    });
};
