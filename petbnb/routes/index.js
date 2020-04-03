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
    res.render('pastBookings', {bookings: rows, current_user: current_user});
  });
});

router.get('/petsitter/:petsitter_id', function(req, res, next) {
  const petSitter_id = req.params.petsitter_id;
  store.getPetSitterProfile(petSitter_id).then(({rows}) => {
    const profileInfo = rows[0];
    store.getReviewsForSitter(petSitter_id).then(({rows}) => {
      res.render('sitterProfile', {current_user: current_user, profile: profileInfo, reviews: rows});
    });
  });
});

router.post('/petsitter/:petsitter_id', function(req, res, next) {
  console.log(req.body);
  const petsitter_id = req.params.petsitter_id;
  let rating = parseInt(req.body.rating);
  
  store.createReview(req.body.user_review, rating, current_user["user_id"],petsitter_id).then(({rows}) => {
    res.redirect(`/petsitter/${petsitter_id}`);
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
