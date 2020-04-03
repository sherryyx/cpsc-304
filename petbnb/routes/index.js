var express = require('express');
var router = express.Router();
const store = require('../store');
const db = require('./../queries');

let current_user;
let current_filter;

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
  db.pool.query(`SELECT * FROM service`, (error, results) => {
    res.render('searchList', {results : results.rows});
  })
});

router.get('/bookService', function(req, res, next) {
  res.render('bookService', {results : []});
});

router.post('/searchResults', function(req, res, next) {
  if (req.body.column == 'pricegt')
  {
    db.pool.query(`SELECT * FROM service WHERE pricePer > ${req.body.textInput}`, (error, results) => {
      if (error) {
        throw error
      }
      current_filter = `pricePer > ${req.body.textInput}`
      res.render('searchResults', {results : results.rows});
    })
  }
  else if (req.body.column == 'pricels')
  {
    db.pool.query(`SELECT * FROM service WHERE pricePer < ${req.body.textInput}`, (error, results) => {
      if (error) {
        throw error
      }
      current_filter = `pricePer < ${req.body.textInput}`
      res.render('searchResults', {results : results.rows});
    })
  }
  else if (req.body.column == 'service')
  {
    db.pool.query(`SELECT * FROM service WHERE serviceType = ${req.body.textInput}`, (error, results) => {
      if (error) {
        throw error
      }
      current_filter = `WHERE serviceType = ${req.body.textInput}`
      res.render('searchResults', {results : results.rows});
    })
  }
});

router.get('/filterGoodSitters', function(req, res, next) {
  db.pool.query(`SELECT T.user_id FROM petsitter T
  WHERE NOT EXISTS 
  (SELECT R.user_id 
    FROM petowner R
    EXCEPT 
    (SELECT S.owneruser_id 
      FROM review S 
      WHERE T.user_id = S.sitteruser_id));` , (error, results) => {
        console.log(results)
    res.render('searchGoodSitters', {results : results.rows})
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
  db.pool.query(`SELECT ${project} FROM service ${current_filter}` , (error, results) => {
    res.render('searchResultsFilter', {results : results.rows})
  })
})

router.post('/bookService', function(req, res, next) {
    db.pool.query(`SELECT user_id, name, bio
    FROM petSitter
    WHERE user_id = ${req.body.user_id};` , (error, result) => {
      db.pool.query(`SELECT review_id, reviewContent, rating, owneruser_id, sitteruser_id, ownerName
      FROM review
      INNER JOIN (SELECT name as ownerName, user_id FROM petOwner) AS ownerNames ON ownerNames.user_id = review.owneruser_id
      WHERE sitteruser_id = ${req.body.user_id}
      ORDER BY review_id ASC;` , (error, results) => {
        res.render('sitterProfile', {profile : result.rows, reviews: results.rows});
      });
    })
});

router.post('/confirmBookService', function(req, res, next) {
  if (req.body.selectpicker == 'Date Available')
  {
    db.pool.query('INSERT INTO booking VALUES (' + ',' + ')', (error, results) => {
      if (error) 
      {
        res.render('homepageowner', {results : results.rows});
        throw error
      }
      console.log(req.body);
      res.render('homepageowner', {results : results.rows});
    })
  }
});

router.get('/searchResults', function(req, res, next) {
  console.log(req.body)
  res.render('searchResults', {results : []});
});

router.get('/sitterRankings', function(req, res, next) {
  db.pool.query(`SELECT S.user_id, AVG(R.rating)
  FROM review R, petSitter S
  WHERE R.sitteruser_id = S.user_id
  GROUP BY S.user_id;`, (error, results) => {
    console.log(results)
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
