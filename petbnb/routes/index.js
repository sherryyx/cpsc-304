var express = require('express');
var router = express.Router();
const store = require('../store');

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
  res.render('searchList', {});
});



module.exports = router;
