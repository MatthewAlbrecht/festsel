var express = require('express');
var router = express.Router();
const boom = require('boom');
const knex = require('../knex');
const bcrypt = require('bcrypt');
const humps = require('humps');
const jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
  res.render('signup', {
    title: 'Create New Account'
  });
});

router.post('/', validateCreate, validateEmail, validateUsername, hashPassword, (req, res, next) => {
  let {
    firstName,
    lastName,
    email,
    hashed_password,
    username
  } = req.body
  // console.log(req.body);
  insertUser(humps.decamelizeKeys({
      firstName,
      lastName,
      email,
      hashed_password,
      username
    }))
    .then(data => {
      console.log(data[0].id, req.body.username);
      console.log('heer');
      let token = jwt.sign({
        id: data[0].id,
        username: req.body.username
      }, 'shhh')
      // console.log(token)
      res.cookie('token', token, {
        httpOnly: true
      })

      res.redirect(`users/${data[0].id}`)

    })
    .catch(err => {
      console.log(err);
      res.end()
    })
  // res.render('index')
  // console.log(req.body.hashed_password);
})

function validateCreate(req, res, next) {
  if (!req.body.username || !req.body.password || !req.body.email || !req.body.firstName || !req.body.lastName) {
    next(boom.create(400, "Bad Username or Pass"))
  }
  next()
}
const insertUser = (user) => knex('users').returning('*').insert(user)

function hashPassword(req, res, next) {
  bcrypt.hash(req.body.password, 12)
    .then(data => {
      delete req.body.password
      req.body.hashed_password = data
      next()
    })
}

function validateEmail(req, res, next) {
  checkEmail(req.body.email)
    .then(data => {
      if (data) {
        console.log(data);
        res.render('signup', {
          title: 'Create New Account',
          error: 'Email Already Exists'
        })
      } else {
        next()
      }
    })
}

function validateUsername(req, res, next) {
  checkUsername(req.body.username)
    .then(data => {
      if (data) {
        console.log(data);
        res.render('signup', {
          title: 'Create New Account',
          error: 'Email Already Exists'
        })
      } else {
        next()
      }
    })
}

const checkEmail = (email) => knex('users').where('email', email).first()
const checkUsername = (username) => knex('users').where('email', username).first()

module.exports = router;
