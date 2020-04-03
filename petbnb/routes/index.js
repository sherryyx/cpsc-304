var express = require('express');
var router = express.Router();
const store = require('../store');

let current_user;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', {});
});

router.get('/home', function(req, res, next) {
  store.getPetsOfPetOwner(current_user["user_id"]).then(({rows}) => {
    res.render('homepageowner', { pets: rows, current_user: current_user });
  });
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

router.get('/login', function(req, res, next) {
  res.render('login', {});
});

router.post('/login', function(req, res, next) {
  store.getPetOwner(req.body).then(({rows}) => {
    current_user = rows[0];
    res.redirect('/home');
  })
});

router.get('/searchList', function(req, res, next) {
  res.render('searchList', {});
});

router.get('/pastBookings', function(req, res, next) {
  store.getBookingInformation(current_user).then(({rows}) => {
    console.log(rows);
    res.render('pastBookings', {bookings: rows, current_user: current_user});
  });
});

router.get('/editProfile', function(req, res, next) {
  res.render('editProfile', {});
});

router.get('/upcomingBookings', function(req, res, next) {
  res.render('upcomingBookings', {});
});

router.get('/pets', function(req, res, next) {
  res.render('pets', {});
});

router.get('/promoCodes', function(req, res, next) {
  res.render('promoCodes', {});
});


module.exports = router;
