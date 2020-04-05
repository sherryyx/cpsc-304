# TA Instructions
## Setting up the database

Enter the postgres console:
```
psql postgres
```

Then run the following SQL commands inside postgres:
```
CREATE ROLE root WITH LOGIN PASSWORD 'password';
create database petbnb;
```
## Run provided script inside the /petbnb folder to create and populate tables
```
./init-db.sh
```

## Starting the server
```
> cd petbnb
> node app.js
```
Open the app here: 
http://localhost:8080/

You're done!
\
\
\
\
\

- - -

# Installing dependencies
```
npm install
```

# Database migrations
We're using [knex](http://knexjs.org/) to deal with database migrations

### General tutorial
[Link to tutorial](https://www.jernejsila.com/2016/09/04/creating-database-migrations-seeds-node-js/)

### Running the migrations
Run this to make sure your database schema is up to date
```
node_modules/.bin/knex migrate:latest
```

### Creating a new migration
Refer to this instructions for making new changes to the database schema

#### Create a new migration file
```
node_modules/.bin/knex migrate:make <file-name>
```
For example, if you're creating a new migration file to create a table called "pet", then you would probably run this:
```
node_modules/.bin/knex migrate:make pet
```

The output should be something like this:
```
Created Migration: /Users/sherryxy/Desktop/UBC/cpsc304/cpsc-304/migrations/20200330210715_pet.js
```

So you can go to that file and write the SQL for the migration. Refer to this [sample migration file](migrations/20200330213838_petOwner.js).
The "up" function is for running the migration, and the "down" function is for rollbacks (undoing whatever you did in "up").

To run the migration you just created, simply run:
```
node_modules/.bin/knex migrate:latest
```

# Seeding the database
Database seeds are useful to initialize the database with initial data, or reset the database with the initial data after making changes to the database.
We're again using [knex](http://knexjs.org/) to deal with database seeds.

### General tutorial
[Link to tutorial](https://www.jernejsila.com/2016/09/04/creating-database-migrations-seeds-node-js/)

### Command to seed the database
```
node_modules/.bin/knex seed:run
```

### Creating "new seeds"
Refer to this instruction to make changes to the seed data or to generate seed data for new tables.

#### Creating a new seed file
```
node_modules/.bin/knex seed:make <file-name>
```
For example, if you're creating a new seed file to populate a table called "pet", then you'd do this:
```
node_modules/.bin/knex seed:make pet
```
The output should be something like this:
```
Created seed file: /Users/sherryxy/Desktop/UBC/cpsc304/cpsc-304/seeds/petOwner.js
```

So you can go to that file and write some scripts/SQL for the seed data. Refer to this [sample seed file](seeds/petOwner.js).

To run the seed you just created, simply run:
```
node_modules/.bin/knex seed:run
```
