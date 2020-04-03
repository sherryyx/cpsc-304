const Pool = require('pg').Pool
const pool = new Pool({
  user: 'jeffrey',
  host: 'localhost',
  database: 'petbnb',
  password: 'password',
  port: 5432,
})