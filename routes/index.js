var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'KTH Study App', name: req.session.user.email });
});

module.exports = router;
