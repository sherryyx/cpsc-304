const knex = require('knex')(require('./knexfile').development);

const getPetsOfPetOwner = (petowner_id) => {
    return knex.raw(`SELECT * FROM pet p
    WHERE p.user_id = ${petowner_id};`);
}

module.exports = {
    getPetsOfPetOwner
};