const Pool = require('pg').Pool
const pool = new Pool({
  user: 'jeffrey',
  host: 'localhost',
  database: 'petbnb',
  password: 'password',
  port: 5432,
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM petboarding;', (error, results) => {
    if (error) {
      throw error
    }
    return results.rows;
  })
}

module.exports = {
  pool
}