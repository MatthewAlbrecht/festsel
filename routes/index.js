var express = require('express');
var router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Login'
  });
});

router.post('/', validateLogin, validateUsername, function(req, res, next) {
  console.log('lit');
});

function validateLogin(req, res, next) {
  if (!req.body.username || !req.body.password) {
    next(boom.create(400, "Bad Username or Password"))
  }
  next()
}

function validateUsername(req, res, next) {
  getUserByUsername(req.body.username)
    .then(data => {
      console.log(data);
      if (data) {
        bcrypt.compare(req.body.password, data.hashed_password, (err, r) => {
          if (r) {
            let token = jwt.sign({
              id: data.id,
              username: req.body.username
            }, 'shhh')
            // console.log(token)
            res.cookie('token', token, {
              httpOnly: true
            })
            res.redirect(`users/${data.id}`)
          }
        })
      } else {
        res.render('index', {
          title: 'Login',
          error: 'Bad Username or Password'
        })
      }
    })
}

const getUserByUsername = (username) => knex('users').where('username', username).select(['username', 'hashed_password', 'id']).first()


module.exports = router;
