exports.up = function(knex) {
    return knex.raw(`CREATE TABLE booking (
        booking_id integer,
        dateBooked date,
        duration float,
        service_id integer NOT NULL,
        petOwner_id integer NOT NULL,
        pet_id integer NOT NULL,
        PRIMARY KEY (booking_id),
        FOREIGN KEY (service_id) REFERENCES service(service_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        FOREIGN KEY (petOwner_id) REFERENCES petOwner(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        FOREIGN KEY (pet_id, petOwner_id) REFERENCES pet(pet_id, user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE)`);
};

exports.down = function(knex) {
    return knex.raw(`DROP TABLE booking`);
};
