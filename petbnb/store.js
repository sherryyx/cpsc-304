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

const priceGt = (textInput) => {
    return knex.raw(`SELECT * FROM service WHERE pricePer > ${textInput};`);
}

const priceLt = (textInput) => {
    return knex.raw(`SELECT * FROM service WHERE pricePer < ${textInput};`);
}

const serviceType = (textInput) => {
    return knex.raw(`SELECT * FROM service WHERE serviceType = ${textInput};`);
}

const getExperiencedSitters = () => {
    return knex.raw(`SELECT T.user_id FROM petsitter T
    WHERE NOT EXISTS 
    (SELECT R.user_id 
      FROM petowner R
      EXCEPT 
      (SELECT S.owneruser_id 
        FROM review S 
        WHERE T.user_id = S.sitteruser_id));`);
}

const sortSearchResults = (project, current_filter) => {
    return knex.raw(`SELECT ${project} FROM service WHERE ${current_filter};`);
}

const getSitterRanking = () => {
    return knex.raw(`SELECT S.user_id, AVG(R.rating)
    FROM review R, petSitter S
    WHERE R.sitteruser_id = S.user_id
    GROUP BY S.user_id;`);
}

module.exports = {
    getPetsOfPetOwner,
    sortSearchResults,
    getSitterRanking,
    createPetOwner,
    getPetOwner,
    getBookingInformation,
    getPetSitterProfile,
    getReviewsForSitter,
    createReview,
    priceGt,
    priceLt,
    serviceType,
    getExperiencedSitters
};