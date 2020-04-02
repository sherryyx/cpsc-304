
exports.up = function(knex) {
    return knex.raw(`CREATE TABLE service (
        service_id serial,
        pricePer float,
        user_id integer,
        serviceType text,
        FOREIGN KEY (user_id) REFERENCES petSitter
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        PRIMARY KEY (service_id)
    )`);
};

exports.down = function(knex) {
    return knex.raw("DROP TABLE service");
};
