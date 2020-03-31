
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE pet (
	pet_id integer,
	name text,
	careInstructions text,
	dietInstructions text,
	age integer,
	breed text,
	weight float,
	user_id integer,
	FOREIGN KEY (user_id) REFERENCES petOwner
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	PRIMARY KEY (pet_id, user_id)
)`);
};

exports.down = function(knex) {
  return knex.raw(`DROP TABLE pet`);
};
