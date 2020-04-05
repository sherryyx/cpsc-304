const knex = require('knex')(require('./knexfile').development);

// Pet owner queries

const getPetsOfPetOwner = (petowner_id) => {
    return knex.raw(`SELECT * FROM pet p
    WHERE p.user_id = ${petowner_id};`);
}

const createPetOwner = ({full_name, phone_number, house_number, street_name, postal_code}) => {
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

const editPetOwner = ({full_name, phone_number, house_number, street_name, postal_code}, user_id) => {
    return knex.raw(`UPDATE petOwner SET
    name = '${full_name}',
    phonenumber = '${phone_number}',
    housenumber = ${house_number},
    street = '${street_name}',
    postalcode = '${postal_code}'
    WHERE user_id = ${user_id}
    returning *;`);
}

// Pet queries

const createPet = ({name, careInstructions, dietInstructions, age, breed, weight}, user_id) => {
    return knex.raw(`INSERT INTO pet (name, careinstructions, dietinstructions, age, breed, weight, user_id)
    VALUES (
      '${name}',
      '${careInstructions}',
      '${dietInstructions}',
      ${age},
      '${breed}',
      ${weight},
      ${user_id}
    );`);
}

const updatePetInfo = ({name, careInstructions, dietInstructions, age, breed, weight}, user_id, pet_id) => {
    return knex.raw(`UPDATE pet SET
    name = '${name}',
    careinstructions = '${careInstructions}',
    dietinstructions = '${dietInstructions}',
    age = ${age},
    breed = '${breed}',
    weight = ${weight}
    WHERE pet_id = ${pet_id} AND user_id = ${user_id};`);
}

const getPetInfo = (pet_id, user_id) => {
    return knex.raw(`SELECT * FROM pet WHERE pet_id = ${pet_id} AND user_id = ${user_id};`);
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

const applyPromoCode = ((booking_id, promocodestring,value) => {
    return knex.raw(`INSERT INTO applyTo VALUES ('${promocodestring}', ${booking_id});
    UPDATE booking 
    SET totalPrice = totalPrice - ${value}
    WHERE booking_id = ${booking_id}`)
})

const getBookings = (user_id) => {
    return knex.raw(`SELECT * FROM booking
    where petOwner_id = ${user_id};`);
}
// Booking queries 

const getBookingInformation = ({user_id}) => {
    return knex.raw(`SELECT user_id, sitter_id, booking_id, duration, pricePer, booking.service_id, sitterName, petName, serviceType, totalPrice
    FROM petOwner
    INNER JOIN booking ON petOwner.user_id = booking.petOwner_id
    INNER JOIN (SELECT service_id, pricePer, service.user_id AS sitter_id, serviceType, name as sitterName
                FROM service
                INNER JOIN petSitter ON petSitter.user_id = service.user_id) AS servicesAndSitters ON booking.service_id = servicesAndSitters.service_id
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
    return knex.raw(`SELECT S.user_id, S.name, AVG(R.rating)
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

const priceGt = (textInput) => {
    return knex.raw(`SELECT service_id, priceper, ps.user_id, serviceType, name FROM service
    JOIN petSitter AS ps ON service.user_id = ps.user_id
    WHERE pricePer > ${textInput};`);
}

const priceLt = (textInput) => {
    return knex.raw(`SELECT service_id, priceper, ps.user_id, serviceType, name FROM service
    JOIN petSitter AS ps ON service.user_id = ps.user_id
    WHERE pricePer < ${textInput};`);
}

const serviceType = (textInput) => {
    return knex.raw(`SELECT service_id, priceper, ps.user_id, serviceType, name FROM service
    JOIN petSitter AS ps ON service.user_id = ps.user_id
    WHERE serviceType = '${textInput}';`);
}

const getExperiencedSitters = () => {
    return knex.raw(`SELECT T.user_id, T.name, COUNT(R.rating)
    FROM petsitter T, review R
    WHERE NOT EXISTS 
    (SELECT R.user_id 
      FROM petowner R
      EXCEPT 
      (SELECT S.owneruser_id 
        FROM review S 
        WHERE T.user_id = S.sitteruser_id))
    AND T.user_id = R.sitteruser_id
    GROUP BY T.user_id
    ORDER BY COUNT(R.rating) desc;`);
}

const sortSearchResults = (project, current_filter) => {
    return knex.raw(`SELECT ${project} FROM service
    JOIN petSitter AS ps ON service.user_id = ps.user_id
    WHERE ${current_filter};`);
}

const getSitterRanking = () => {
    return knex.raw(`SELECT S.user_id, S.name, AVG(R.rating)
    FROM review R, petSitter S
    WHERE R.sitteruser_id = S.user_id
    GROUP BY S.user_id
    ORDER BY AVG(R.rating) desc;`);
}

const insertBooking = (time, service_id, user_id, pet_id) => {
    return knex.raw(`SELECT pet_id FROM pet;`).then((rows) => {
        console.log(rows);
        return knex.raw(`SELECT pricePer FROM service WHERE service_id = ${service_id}`).then((row1) => {
            let pricePer = row1.rows[0].priceper;
            let totalPrice = pricePer * time;
            console.log("totalPrice: " + totalPrice);
            return knex.raw(`INSERT INTO booking (duration, totalPrice, service_id, petowner_id, pet_id)
            VALUES ( ${time}, ${totalPrice} ,${service_id}, ${user_id}, ${pet_id});`).then(
                console.log("Successfully added booking")
            );          
        })
    })
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
    createPet,
    removePet,
    updatePetInfo,
    searchForPromoCode,
    redeemPromoCode,
    applyPromoCode,
    getAverageRating,
    getBookings,
    filterServices,
    groupAverageRatingByPetSitter,
    priceGt,
    priceLt,
    serviceType,
    getExperiencedSitters,
    insertBooking,
    getPetInfo,
    editPetOwner
}