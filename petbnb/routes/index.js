var express = require('express');
var router = express.Router();
const store = require('../store')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  console.log("home");
  store.getPetsOfPetOwner(1).then((data) => {
    console.log(data);
    res.render('homepageowner', { title: "hello" });
  })
});

module.exports = router;
