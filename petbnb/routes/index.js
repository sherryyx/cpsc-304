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
  res.render('searchList')
});

router.post('/bookService', function(req, res, next) {
  res.render('bookService', {service_id : req.body.service_id, user_id : req.body.user_id});
});

router.post('/searchResults', function(req, res, next) {
  if (req.body.column == 'pricegt')
  {
    store.priceGt(req.body.textInput).then((results) => {
      current_filter = `pricePer > ${req.body.textInput}`
      res.render('searchResults', {results : results.rows});
    })
  }
  else if (req.body.column == 'pricels')
  {
    store.priceLs(req.body.textInput).then((results) => {
      current_filter = `pricePer < ${req.body.textInput}`
      res.render('searchResults', {results : results.rows});
    })
  }
  else if (req.body.column == 'service')
  {
    store.serviceType(req.body.textInput).then((results) => {
      current_filter = `serviceType = ${req.body.textInput}`
      res.render('searchResults', {results : results.rows});
    })
  }
});

router.get('/filterGoodSitters', function(req, res, next) {
  store.getExperiencedSitters().then((results) => {
    res.render('searchGoodSitters', {results : results.rows});
  })
})

router.post('/searchResultsFilter', function(req, res, next) {
  console.log(req.body)
  let project = ""
  if (req.body.col1 != null)
  {
    project = 'service_id'
  }
  if (req.body.col2 != null)
  {
    project = project == "" ? 'priceper' : project + ', ' + 'priceper'
  }
  if (req.body.col3 != null)
  {
    project = project == "" ? 'user_id' : project + ', ' + 'user_id'
  }
  if (req.body.col4 != null)
  {
    project = project == "" ? 'servicetype' : project + ', ' + 'servicetype'
  }
  store.sortSearchResults(project, current_filter).then((results) => {
    res.render('searchResultsFilter', {results : results.rows});
  })
})

router.post('/getProfile', function(req, res, next) {
  store.getPetSitterProfile(req.body.user_id).then((result) => {
    store.getReviewsForSitter(req.body.user_id).then((results) => {
      res.render('sitterProfile', {profile : result.rows, reviews : results.rows});
    })
  })
});

router.post('/confirmBookService', function(req, res, next) {
  let pet_id = 1;
    store.insertBooking(req.body.duration, req.body.service_id, current_user["user_id"], pet_id).then((results) => {
      res.redirect('/home');
    })
});

router.get('/searchResults', function(req, res, next) {
  console.log(req.body)
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

// Get pet sitter profile
router.get('/petsitter/:petsitter_id', function(req, res, next) {
  const petSitter_id = req.params.petsitter_id;
  store.getPetSitterProfile(petSitter_id).then(({rows}) => {
    const profileInfo = rows[0];
    store.getReviewsForSitter(petSitter_id).then(({rows}) => {
      const reviews = rows;
      store.getAverageRating(petSitter_id).then(({rows}) => {
        console.log(rows[0]);
        const averageRating = rows[0];
        res.render('sitterProfile', {current_user: current_user, profile: profileInfo, reviews: reviews, averageRating: averageRating});
      });
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
