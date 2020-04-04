
exports.up = function(knex) {
    return knex.raw(`CREATE TABLE booking (
        booking_id serial,
        duration float,
        totalPrice float,
        service_id integer NOT NULL,
        petOwner_id integer NOT NULL,
        pet_id integer NOT NULL,
        FOREIGN KEY (service_id) REFERENCES service (service_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        FOREIGN KEY (petOwner_id) REFERENCES petOwner (user_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        FOREIGN KEY (pet_id) REFERENCES pet (pet_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        PRIMARY KEY (booking_id)
    );`);
};

exports.down = function(knex) {
    return knex.raw("DROP TABLE booking;");
};
