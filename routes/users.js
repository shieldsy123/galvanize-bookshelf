'use strict'

const express = require('express')
const humps = require('humps')
const camelCase = require('camelcase-keys')
const knex = require('../knex')
const decamelize = require('decamelize')
const bcrypt = require('bcrypt')

// eslint-disable-next-line new-cap
const router = express.Router()

router.post('/users', (req, res, next) => {
  const saltInt = 10
  bcrypt.genSalt(saltInt, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (error, hash) => {
      knex('users')
        .insert(humps.decamelizeKeys({
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          hashed_password: hash
        }))
        .returning(['id', 'first_name', 'last_name', 'email'])
        .then((object) => {
          res.json(humps.camelizeKeys(object[0]))
        })
    })
  })
})

module.exports = router
