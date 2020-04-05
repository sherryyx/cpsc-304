exports.up = function(knex) {
    return knex.raw(`CREATE TABLE applyTo (
        promoCodeString text,
        booking_id integer,
        PRIMARY KEY (booking_id, promoCodeString),
        FOREIGN KEY (booking_id) REFERENCES booking
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        FOREIGN KEY (promoCodeString) REFERENCES promoCode
            ON DELETE CASCADE
            ON UPDATE CASCADE);`);
};

exports.down = function(knex) {
    return knex.raw(`DROP TABLE applyTo`);
};