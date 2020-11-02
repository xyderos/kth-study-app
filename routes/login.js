var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('users');
  var enteredEmail = req.body.email;
  var enteredPassword = req.body.password;

  collection.findOne({'email':enteredEmail}, function(e, user) {
      if (user == null) {
        res.send({ msg: 'Wrong credentials'});
      } else {
        if (enteredPassword === user.password) {
          req.session.user = user;
          res.send({ msg: 'success'});
        } else {
          res.send({ msg: 'Wrong credentials'});
        }
      }
  });
});

module.exports = router;
