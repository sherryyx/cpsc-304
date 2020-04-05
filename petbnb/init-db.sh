npm install;
node_modules/.bin/knex migrate:rollback --all;
node_modules/.bin/knex migrate:latest;
node_modules/.bin/knex seed:run;
