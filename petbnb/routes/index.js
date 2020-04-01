var express = require('express');
var router = express.Router();
const store = require('../store')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  store.getPetsOfPetOwner(1).then(({rows}) => {
    res.render('homepageowner', { pets: rows });
  })
});

router.get('/landing', function(req, res, next) {
  res.render('landing', {});
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {});
});

router.post('/signup', function(req, res, next) {
  console.log("CREATING USER!!!");
  console.log(req.body);
  res.redirect('/home');
});



module.exports = router;
