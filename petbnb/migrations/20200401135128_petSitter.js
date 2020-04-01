
exports.up = function(knex) {
    return knex.raw(`CREATE TABLE petSitter (
        user_id serial,
        phoneNumber text,
        name text,
        bio text,
        houseNumber integer,
        street text,
        postalCode text,
        PRIMARY KEY (user_id)
    )`);
};

exports.down = function(knex) {
    return knex.raw("DROP TABLE petSitter");
};
