var express = require('express');
var router = express.Router();

router.get('/create', function(req, res, next) {
  res.render('new-user');
})

router.post('/signout', function(req, res, next) {
  req.session.user = null;
  res.send({msg : 'success'});
})

router.post('/create', function(req, res, next) {
  var db = req.db;
  var collection = db.get('users');

  collection.findOne({'email' : req.body.email }, function(err, result) {
      if (result) {
        res.send(
          (err === null) ? { msg: 'name is already taken' } : { msg: err }
        );
      } else {
        collection.insert(req.body, function(err, result) {
          res.send(
            (err === null) ? { msg: 'success', user: result } : { msg: err }
          );
        });
      }
  })
});

router.delete('/delete/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('users');
  var idToDelete = req.params.id;

  collection.remove({_id : idToDelete }, function (err, result){
    res.send(
      (err == null) ? { msg: 'success'} : { msg: err }
    );
  });
});

module.exports = router;
