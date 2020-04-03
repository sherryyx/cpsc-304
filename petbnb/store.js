const knex = require('knex')(require('./knexfile').development);

// Pet owner queries

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

// Pet queries

const createPet = (name, careinstructions, dietinstructions, age, breed, weight, user_id) => {
    return knex.raw(`INSERT INTO pet (pet_id, name, careinstructions, dietinstructions, age, breed, weight, user_id)
    VALUES (
      '${name}',
      '${careinstructions}',
      '${dietinstructions}',
      ${age},
      '${breed}',
      ${weight},
      ${user_id}
    );`);
}

const getPetNameGivenID = (pet_id) => {
    return knex.raw(`SELECT name FROM pet p
    WHERE p.pet_id = ${pet_id};`);
}

const updatePetInfo = (name, careInstructions, dietInstructions, age, breed, weight, user_id, pet_id) => {
    return knex.raw(`UPDATE pet SET
    name = '${name}',
    careinstructions = '${careInstructions}',
    dietinstructions = '${dietInstructions}',
    age = ${age},
    breed = '${breed}',
    weight = ${weight}
    WHERE pet_id = ${pet_id} AND user_id = ${user_id};`);
}

const removePet = (pet_id, user_id) => {
    return knex.raw(`DELETE FROM pet WHERE pet_id = ${pet_id} AND user_id = ${user_id};`);
}     

// Promo code queries

const searchForPromoCode = (promoCodeString) => {
    return knex.raw(`SELECT * FROM promoCode WHERE promocodestring = '${promoCodeString}';`);
}

const redeemPromoCode = (promoCodeString, user_id) => {
    return knex.raw(`INSERT INTO redeems VALUES ('${promoCodeString}', '${user_id}')`)
}

// Booking queries 

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

// Pet sitter profile queries

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

// Get average rating for a single pet sitter
const getAverageRating = (user_id) => {
    return knex.raw(`SELECT AVG(rating)
    FROM review
    WHERE sitteruser_id = ${user_id};`)
}


// Service list queries

// Group average rating by pet sitter
const groupAverageRatingByPetSitter = (() => {
    return knex.raw(`SELECT S.user_id, AVG(R.rating)
    FROM review R, petSitter S
    WHERE R.sitteruser_id = S.user_id
    GROUP BY S.user_id;`)
});

// Filter services
const filterServices = ((field, value, sign) => {
    if (field === 'pricePer') {
        return knex.raw(`SELECT * 
        FROM service
        WHERE pricePer '${sign}' ${value}` );
    } else if (field === 'serviceType') {
        return knex.raw(`SELECT * 
        FROM service
        WHERE serviceType = ${value}` );
    }
})


module.exports = {
    getPetsOfPetOwner,
    createPetOwner,
    getPetOwner,
    getBookingInformation,
    getPetSitterProfile,
    getReviewsForSitter,
    createReview,
    createPet,
    removePet,
    updatePetInfo,
    searchForPromoCode,
    redeemPromoCode,
    getAverageRating,
    filterServices,
    groupAverageRatingByPetSitter
};