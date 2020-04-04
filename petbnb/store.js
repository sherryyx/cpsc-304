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

const getBookings = (user_id) => {
    return knex.raw(`SELECT * FROM booking
    where petOwner_id = ${user_id};`);
}

const getPetNameGivenID = (pet_id) => {
    return knex.raw(`SELECT name FROM pet p
    WHERE p.pet_id = ${pet_id};`);
}

const getBookingInformation = ({user_id}) => {
    return knex.raw(`SELECT user_id, booking_id, duration * pricePer as totalPrice, duration, pricePer, booking.service_id, sitterName, petName, serviceType
    FROM petOwner
    INNER JOIN booking ON petOwner.user_id = booking.petOwner_id
    INNER JOIN (SELECT service_id, pricePer, user_id AS sitter_name, serviceType FROM service) AS services ON booking.service_id = services.service_id
    INNER JOIN (SELECT user_id as sitter_id, name as sitterName FROM petSitter) AS sitterInfo ON sitterInfo.sitter_id = booking.service_id
    INNER JOIN (SELECT name AS petName, pet_id FROM pet) AS petNames ON petNames.pet_id = booking.pet_id
    WHERE user_id = ${user_id};
    `)
}

const removePet = (pet_id, user_id) => {
    return knex.raw(`DELETE FROM pet WHERE pet_id = ${pet_id} AND user_id = ${user_id};`);
}                                               

const searchForPromoCode = (promoCodeString) => {
    return knex.raw(`SELECT * FROM promoCode WHERE promocodestring = '${promoCodeString}';`);
}

const createPet = (pet_id, name, careinstructions, dietinstructions, age, breed, weight, user_id) => {
    return knex.raw(`INSERT INTO pet (pet_id, name, careinstructions, dietinstructions, age, breed, weight, user_id)
    VALUES (
      ${pet_id},
      '${name}',
      '${careinstructions}',
      '${dietinstructions}',
      ${age},
      '${breed}',
      ${weight},
      ${user_id}
    );`);
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

const getUpcomingBookings =  () => {   
return knex.raw(`SELECT * FROM promoCode WHERE promocodestring = '${promoCodeString}';`);
};

const redeemPromoCode = (promoCodeString, user_id) => {
    return knex.raw(`INSERT INTO redeems VALUES ('${promoCodeString}', '${user_id}')`)
}

// Regular Aggregation Query
const averagePetSitterRating = (() => {
    return knex.raw(`SELECT AVG(R.rating)
    FROM review R, petSitter S
    WHERE R.sitteruser_id = S.user_id;`)
});

// Group By Aggregation Query
const groupByAveragePetSitterRating = (() => {
    return knex.raw(`SELECT S.user_id, AVG(R.rating)
    FROM review R, petSitter S
    WHERE R.sitteruser_id = S.user_id
    GROUP BY S.user_id;`)
});

// Filter Services
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

const applyPromoCode = ((booking_id, promocodestring,value) => {
    return knex.raw(`INSERT INTO applyTo VALUES ('${promocodestring}', ${booking_id});
    UPDATE booking 
    SET totalPrice = totalPrice - ${value}
    WHERE booking_id = ${booking_id}`)
})

module.exports = {
    getPetsOfPetOwner,
    createPetOwner,
    getPetOwner,
    getBookingInformation,
    createPet,
    removePet,
    updatePetInfo,
    searchForPromoCode,
    getUpcomingBookings,
    redeemPromoCode,
    averagePetSitterRating,
    filterServices,
    groupByAveragePetSitterRating,
    applyPromoCode,
    getBookings
};