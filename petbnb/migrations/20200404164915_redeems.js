
exports.up = function(knex) {
    return knex.raw(`CREATE TABLE redeems (
        promoCodeString text,
        user_id integer,
        PRIMARY KEY (user_id, promoCodeString),
        FOREIGN KEY (promoCodeString) REFERENCES promoCode,
        FOREIGN KEY (user_id) REFERENCES petOwner
        );`);
};

exports.down = function(knex) {
    return knex.raw("DROP TABLE redeems");
};