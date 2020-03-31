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

## Installing dependencies
```
npm install
```

## Database migrations/seeds
We're using [knex](http://knexjs.org/) to deal with database migrations and seeds

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
