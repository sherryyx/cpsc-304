exports.up = function(knex) {
    return knex.raw(`CREATE TABLE promoCode (
        value float,
        promoCodeString text,
        PRIMARY KEY (promoCodeString)
    )`);
};

exports.down = function(knex) {
    return knex.raw(`DROP TABLE promoCode`);
};