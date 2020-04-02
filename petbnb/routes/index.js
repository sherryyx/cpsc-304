var express = require('express');
var router = express.Router();
const store = require('../store');
const db = require('./../queries');

let current_user;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  store.getPetsOfPetOwner(current_user["user_id"]).then(({rows}) => {
    res.render('homepageowner', { pets: rows, current_user: current_user });
  });
});

router.get('/landing', function(req, res, next) {
  res.render('landing', {});
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {});
});

router.post('/signup', function(req, res, next) {
  store.createPetOwner(req.body).then(({rows}) => {
    current_user = rows[0];
    res.redirect('/home');
  });
});

router.get('/searchList', function(req, res, next) {
    res.render('searchList', {results : []});
});

router.get('/bookService', function(req, res, next) {
  res.render('bookService', {results : []});
});

router.post('/searchResults', function(req, res, next) {
  if (req.body.selectpicker == 'Date Available')
  {
    db.pool.query('SELECT * FROM petboarding;', (error, results) => {
      if (error) {
        throw error
      }
      console.log(req.body);
      res.render('searchResults', {results : results.rows});
    })
  }
  else if (req.body.selectpicker == 'Name')
  {

  }
  else
  {

  }
});

router.post('/bookService', function(req, res, next) {
  if (req.body.selectpicker == 'Date Available')
  {
    db.pool.query('INSERT INTO booking VALUES (' + ',' + ')', (error, results) => {
      if (error) 
      {
        throw error
      }
      console.log(req.body);
      res.render('bookService', {results : results.rows});
    })
  }
});

router.get('/searchResults', function(req, res, next) {
  res.render('searchResults', {results : []});
});







module.exports = router;
