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

router.get('/myPets', function(req, res, next) {
  store.getPetsOfPetOwner(current_user["user_id"]).then(({rows}) => {
    res.render('myPets', { pets: rows, current_user: current_user });
  });
});

router.post('/myPets', function(req, res) {
  let body = req.body;
  if (typeof body.type1 !== 'undefined' && body.type !== 'update') { 
  store.removePet(body.pet_id1, current_user["user_id"]).then(() => {
    store.getPetsOfPetOwner(current_user["user_id"]).then(({rows}) => {
      res.render('myPets', { pets: rows, current_user: current_user });
    });
  }).catch((error) => {
    console.log('Error was caught in delete');
  });
} else if (body.type === 'update') {
  store.updatePetInfo(body["name"],body["careinstructions"], body["dietinstructions"], 
  body["age"], body["breed"], body["weight"], current_user["user_id"], body["pet_id"]).then(() => {
    store.getPetsOfPetOwner(current_user["user_id"]).then(({rows}) => {
      res.render('myPets', { pets: rows, current_user: current_user });
    });
}).catch((error) => {
  console.log('Error was caught in update');
})
} else if (body.type === 'add') {
  store.createPet(body["pet_id2"], body["name"], body["careinstructions"], body["dietinstructions"], 
  body["age"], body["breed"], body["weight"], current_user["user_id"]).then(() => {
    store.getPetsOfPetOwner(current_user["user_id"]).then(({rows}) => {
      res.render('myPets', { pets: rows, current_user: current_user });
    });
  }).catch((error) => {
    console.log('Error was caught in add');
  })
}
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
  res.render('promoCodes', {code:[]});
});

router.post('/promoCodes', function(req, res, next) {
  console.log(req.body);
  store.searchForPromoCode(req.body.promoCode).then(({rows}) => {
    console.log(rows[0]);
    store.redemPromoCode(rows[0].promocodestring, current_user["user_id"]).then(() => {
      res.render('promoCodes', {})
    })
})
});

module.exports = router;
