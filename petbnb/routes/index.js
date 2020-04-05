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

// Get pets view
router.get('/pets', function(req, res, next) {
  store.getPetsOfPetOwner(current_user["user_id"]).then(({rows}) => {
    res.render('Pets', { pets: rows, current_user: current_user });
  });
});

router.get('/pet/:pet_id', function(req, res, next) {
  const pet_id = req.params.pet_id;
  store.getPetInfo(pet_id, current_user["user_id"]).then(({rows}) => {
    const pet = rows[0];
    res.render('editPet', { pet: pet});
  });
});

router.post('/pet/:pet_id', function(req, res, next) {
  const pet_id = req.params.pet_id;
  let careInstructions = req.body.careInstructions;
  let dietInstructions = req.body.dietInstructions;
  careInstructions = careInstructions.replace(/\'/g, "''");
  dietInstructions = dietInstructions.replace(/\'/g, "''");
  store.updatePetInfo(req.body, careInstructions, dietInstructions, current_user["user_id"], pet_id).then(() => {
    res.redirect('/pets');
  });
});

router.get('/remove-pet/:pet_id', function(req, res, next) {
  const pet_id = req.params.pet_id;
  store.removePet(pet_id, current_user["user_id"]).then(() => {
    res.redirect('/pets');
  });
});

router.get('/create-pet', function(req, res, next) {
  res.render('createPet', {});
});

router.post('/pets', function(req, res, next) {
  store.createPet(req.body, current_user["user_id"]).then(() => {
    res.redirect('/pets');
  });
});


router.get('/searchList', function(req, res, next) {
  res.render('searchList')
});

router.post('/bookService', function(req, res, next) {
  console.log(req.body);
  store.getPetName(req.body.pet_id, current_user["user_id"]).then(({rows}) => {
    const pet_name = rows[0].name;
    console.log(pet_name);
    res.render('bookService', {service_id : req.body.service_id, pet_name: pet_name,
      service_type: req.body.servicetype, pet_id: req.body.pet_id, name: req.body.name, price_per : req.body.priceper});
  });
});

router.post('/confirmBookService', function(req, res, next) {
  console.log(req.body);
    store.insertBooking(req.body.duration, req.body.service_id, current_user["user_id"], req.body.pet_id).then((results) => {
      res.redirect('/pastBookings');
    })
});

router.post('/searchResults', function(req, res, next) {
  store.getPetsOfPetOwner(current_user['user_id']).then((pets) => {
    let myPets = pets.rows;
    if (req.body.column == 'pricegt')
    {
      store.priceGt(req.body.textInput).then((results) => {
        current_filter = `pricePer > ${req.body.textInput}`
        res.render('searchResults', {results : results.rows, pets: myPets});
      })
    }
    else if (req.body.column == 'pricelt')
    {
      store.priceLt(req.body.textInput).then((results) => {
        current_filter = `pricePer < ${req.body.textInput}`
        res.render('searchResults', {results : results.rows, pets: myPets});
      })
    }
    else if (req.body.column == 'service')
    {
      store.serviceType(req.body.textInput).then((results) => {
        current_filter = `serviceType = '` + `${req.body.textInput}` + '\'';
        res.render('searchResults', {results : results.rows, pets: myPets});
      })
    }
  })
});

router.get('/filterGoodSitters', function(req, res, next) {
  store.getExperiencedSitters().then((results) => {
    console.log(results);
    res.render('searchGoodSitters', {results : results.rows});
  })
})

router.post('/searchResultsFilter', function(req, res, next) {
  let project = ""
  if (req.body.col1 != null)
  {
    project = 'name'
  }
  if (req.body.col2 != null)
  {
    project = project == "" ? 'priceper' : project + ', ' + 'priceper'
  }
  if (req.body.col3 != null)
  {
    project = project == "" ? 'servicetype' : project + ', ' + 'servicetype'
  }
  store.sortSearchResults(project, current_filter).then(({rows}) => {
    const columns = Object.keys(rows[0]);
    const col_to_display = {
      name: "Name",
      priceper: "Price/hr",
      servicetype: "Service type"
    };
    const columns_to_display = columns.map((col) => col_to_display[col]);
    store.getPetsOfPetOwner(current_user['user_id']).then((pets) => {
      let myPets = pets.rows;
      res.render('searchResultsFilter', {
        results : rows, 
        columns_to_display: columns_to_display,
        columns: columns,
        pets: myPets
      });
    });
  })
})


router.get('/searchResults', function(req, res, next) {
  res.render('searchResults', {results : []});
});

router.get('/sitterRankings', function(req, res, next) {
  store.getSitterRanking().then((results) => {
    res.render('sitterRankings', {results : results.rows});
  })
});

router.get('/pastBookings', function(req, res, next) {
  store.getBookingInformation(current_user).then(({rows}) => {
    res.render('pastBookings', {bookings: rows, current_user: current_user});
  });
});

// Get pet sitter profile with review input
router.get('/petsitter-review/:petsitter_id', function(req, res, next) {
  const petSitter_id = req.params.petsitter_id;
  store.getPetSitterProfile(petSitter_id).then(({rows}) => {
    const profileInfo = rows[0];
    store.getReviewsForSitter(petSitter_id).then(({rows}) => {
      const reviews = rows;
      store.getAverageRating(petSitter_id).then(({rows}) => {
        let averageRating = rows[0].avg;
        if (averageRating == null) {
          averageRating = 'No ratings yet'
        } else {
          averageRating = parseFloat(averageRating).toFixed(2);
        }
        res.render('sitterProfileReview', {current_user: current_user, profile: profileInfo, reviews: reviews, averageRating: averageRating});
      });
    });
  });
});

router.post('/petsitter-review/:petsitter_id', function(req, res, next) {
  const petsitter_id = req.params.petsitter_id;
  let rating = parseInt(req.body.rating);
  let userReview = req.body.user_review;
  userReview = userReview.replace(/\'/g, "''");
  store.createReview(userReview, rating, current_user["user_id"],petsitter_id).then(({rows}) => {
    res.redirect(`/petsitter-review/${petsitter_id}`);
  });
});

// Get pet sitter profile without ability to review
router.get('/petsitter/:petsitter_id', function(req, res, next) {
  const petSitter_id = req.params.petsitter_id;
  store.getPetSitterProfile(petSitter_id).then(({rows}) => {
    const profileInfo = rows[0];
    store.getReviewsForSitter(petSitter_id).then(({rows}) => {
      const reviews = rows;
      store.getAverageRating(petSitter_id).then(({rows}) => {
        let averageRating = rows[0].avg;
        if (averageRating == null) {
          averageRating = 'No ratings yet'
        } else {
          averageRating = parseFloat(averageRating).toFixed(2);
        }
        res.render('sitterProfile', {current_user: current_user, profile: profileInfo, reviews: reviews, averageRating: averageRating});
      });
    });
  });
});

// View and edit pet owner profile
router.get('/edit-profile', function(req, res, next) {
  res.render('editProfile', {current_user: current_user});
});

router.get('/profile', function(req, res, next) {
  res.render('profile', {current_user: current_user});
});

router.post('/edit-profile', function(req, res, next) {
  store.editPetOwner(req.body, current_user["user_id"]).then(({rows}) => {
    current_user = rows[0];
    res.redirect('/profile');
  });
});

// Promo code

router.get('/promoCodes', function(req, res, next) {
  store.getBookingInformation(current_user).then((rows) => {
    res.render('promoCodes', {bookings: rows.rows});
  })
});

router.post('/promoCodes', function(req, res, next) {
  store.searchForPromoCode(req.body.promoCode).then(({rows}) => {
    let promo = rows[0];
    store.redeemPromoCode(req.body.promoCode, current_user["user_id"]).then(() => {
      store.applyPromoCode(req.body.booking_id, req.body.promoCode, promo.value).then(() => {
        store.getBookingInformation(current_user).then((rows) => {
          res.render('promoCodes', {bookings: rows.rows, promo, applied: 1});
        })
      })
    })
  })
});


module.exports = router;
