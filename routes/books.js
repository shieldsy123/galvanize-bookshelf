'use strict'

const express = require('express')
const humps = require('humps')
const camelCase = require('camelcase-keys')
const knex = require('../knex')
const decamelize = require('decamelize')
const bcrypt = require('bcrypt')

// eslint-disable-next-line new-cap
const router = express.Router()

// YOUR CODE HERE
// RETRIEVE ALL BOOKS FROM THE /BOOKS DIRECTORY
router.get('/books', (req, res, next) => {
  knex('books').orderBy('title')
    .then((arr) => {
      // console.log(arr)
      res.json(humps.camelizeKeys(arr))
    })
    .catch((error) => {
      next(error)
    })
})

// RETRIEVE BOOK SPECIFIED BY ID
router.get('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .then((object) => {
      res.json(humps.camelizeKeys(object[0]))
    })
})

// POST NEW BOOK TO /BOOKS DIRECTORY
router.post('/books', (req, res, next) => {
  knex('books')
    .insert(humps.decamelizeKeys({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      coverUrl: req.body.coverUrl
    }))
    .returning('*')
    .then((object) => {
      res.json(humps.camelizeKeys(object[0]))
    })
})

// UPDATE A SPECIFIC BOOK BY ID
router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .limit(1)
    .where('id', req.params.id)
    .update(humps.decamelizeKeys({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      coverUrl: req.body.coverUrl
    }))
    .returning('*')
    .then((object) => {
      res.json(humps.camelizeKeys(object[0]))
    })
})

// DELETE A SPECIFIC BOOK BY ID
router.delete('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((object) => {
      if (!object) return next()
      const decamObject = humps.decamelizeKeys(object)
      const finalObj = {
        title: decamObject.title,
        author: decamObject.author,
        genre: decamObject.genre,
        description: decamObject.description,
        cover_url: decamObject.cover_url
      }
      return knex('books')
        .where('id', req.params.id)
        .then(() => {
          res.json(humps.camelizeKeys(finalObj))
        })
    })

})

module.exports = router
