var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', verifyToken, function(req, res, next) {

  res.render('users', {
    title: req.cookies.token
  })
});

router.get('/:id', function(req, res, next) {
  jwt.verify(req.cookies.token, 'shhh', function(err, decoded) {
    console.log(Object.keys(decoded));
    if (decoded.id == req.params.id) {
      res.render('users', {
        title: decoded.id
      })
    } else {
      res.clearCookie('token')
      res.redirect('/')
    }

  });
});

function verifyToken(req, res, next) {

}

module.exports = router;
