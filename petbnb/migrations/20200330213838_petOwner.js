
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE petOwner (
	user_id integer,
	phoneNumber text,
	name text,
	houseNumber integer,
	street text,
	postalCode text,
	PRIMARY KEY (user_id)
)`);
};

exports.down = function(knex) {
  return knex.raw("DROP TABLE petOwner");
};
