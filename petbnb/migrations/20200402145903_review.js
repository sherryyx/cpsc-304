
exports.up = function(knex) {
    return knex.raw(`CREATE TABLE review (
        review_id serial,
        reviewContent text,
        rating integer,
        ownerUser_id integer NOT NULL,
        sitterUser_id integer NOT NULL,
        FOREIGN KEY (ownerUser_id) REFERENCES petOwner (user_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        FOREIGN KEY (sitterUser_id) REFERENCES petSitter (user_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        PRIMARY KEY (review_id)
    )`);
};

exports.down = function(knex) {
    return knex.raw("DROP TABLE review");
};
