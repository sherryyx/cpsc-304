
exports.up = function(knex) {
    return knex.raw(`CREATE TABLE redeems (
        promoCodeString text,
        user_id integer,
        FOREIGN KEY (promoCodeString) REFERENCES promoCode
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES petOwner
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        PRIMARY KEY (user_id, promoCodeString)
        )`);
};

exports.down = function(knex) {
    return knex.raw("DROP TABLE redeems");
};