
exports.up = function(knex) {
    return knex.raw(`CREATE TABLE service (
        service_id integer,
        pricePer float,
        user_id integer,
        serviceType text,
        PRIMARY KEY (service_id),
        FOREIGN KEY (user_id) REFERENCES petOwner)`);
};

exports.down = function(knex) {
    return knex.raw(`DROP TABLE service`);
};
