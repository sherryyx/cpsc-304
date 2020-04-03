const knex = require('knex')(require('./knexfile').development);

const getPetsOfPetOwner = (petowner_id) => {
    return knex.raw(`SELECT * FROM pet p
    WHERE p.user_id = ${petowner_id};`);
}

const createPetOwner = ({full_name, email_address, phone_number, house_number, street_name, postal_code, user_type}) => {
    return knex.raw(`INSERT INTO petOwner (phonenumber, name, housenumber, street, postalcode)
    VALUES (
      '${phone_number}',
      '${full_name}',
      ${house_number},
      '${street_name}',
      '${postal_code}'
    ) returning *;`);
}

const getPetOwner = ({user_id}) => {
    return knex.raw(`SELECT * FROM petOwner
    where user_id = ${user_id};`);
}

const getPetNameGivenID = (pet_id) => {
    return knex.raw(`SELECT name FROM pet p
    WHERE p.pet_id = ${pet_id};`);
}

const getBookingInformation = ({user_id}) => {
    return knex.raw(`SELECT user_id, sitter_id, booking_id, duration * pricePer as totalPrice, duration, pricePer, booking.service_id, sitterName, petName, serviceType
    FROM petOwner
    INNER JOIN booking ON petOwner.user_id = booking.petOwner_id
    INNER JOIN (SELECT service_id, pricePer, user_id AS sitter_name, serviceType FROM service) AS services ON booking.service_id = services.service_id
    INNER JOIN (SELECT user_id as sitter_id, name as sitterName FROM petSitter) AS sitterInfo ON sitterInfo.sitter_id = booking.service_id
    INNER JOIN (SELECT name AS petName, pet_id FROM pet) AS petNames ON petNames.pet_id = booking.pet_id
    WHERE user_id = ${user_id};
    `);
}

const getPetSitterProfile = (user_id) => {
    return knex.raw(`SELECT user_id, name, bio
    FROM petSitter
    WHERE user_id = ${user_id};`);
}

const getReviewsForSitter = (user_id) => {
    return knex.raw(`SELECT review_id, reviewContent, rating, owneruser_id, sitteruser_id, ownerName
    FROM review
    INNER JOIN (SELECT name as ownerName, user_id FROM petOwner) AS ownerNames ON ownerNames.user_id = review.owneruser_id
    WHERE sitteruser_id = ${user_id}
    ORDER BY review_id ASC;`)
}

const createReview = (reviewcontent, rating, owneruser_id, sitteruser_id) => {
    return knex.raw(`INSERT INTO review (reviewContent, rating, ownerUser_id, sitterUser_id)
    VALUES (
      '${reviewcontent}',
      ${rating},
      ${owneruser_id},
      ${sitteruser_id}
    ) returning *;`);
}

module.exports = {
    getPetsOfPetOwner,
    createPetOwner,
    getPetOwner,
    getBookingInformation,
    getPetSitterProfile,
    getReviewsForSitter,
    createReview
};