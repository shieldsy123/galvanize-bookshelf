'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
// humps is an underscore-to-camelCase converter (& vice-versa) for strings and object keys in JavaScript
const humps = require('humps');
const KEY = process.env.JWT_KEY
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.get('/books', (req, res, next) => {
  knex('books')
    .then((data) => {
      data.sort((a, b) => {
        if (a.title > b.title) {
          return 1
        } else {
          return -1
        }
      })
      res.json(humps.camelizeKeys(data))
    })
    .catch((err) => {
      next(err)
    })
})

router.get('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .then((data) => {
      res.json(humps.camelizeKeys(data[0]))
    })
    .catch((err) => {
      next(err)
    })
})

router.post('/books', (req, res, next) => {
  knex('books')
    .insert(humps.decamelizeKeys({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    }))
    .returning('*')
    .then((data) => {

      res.json(humps.camelizeKeys(data[0]))
    })
    .catch((err) => {
      next(err)
    })
})

router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .then((data) => {
      knex('books')
        .where('id', req.params.id)
        .limit(1)
        .update(humps.decamelizeKeys({
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          description: req.body.description,
          cover_url: req.body.coverUrl
        }))
        .returning('*')
        .then((data) => {
          res.json(humps.camelizeKeys(data[0]))
        })
    })
    .catch((err) => {
      next(err)
    })
})

router.delete('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((data) => {
      if (!data) return next()
      const decammed = humps.decamelizeKeys(data)
      const newData = {
        title: decammed.title,
        author: decammed.author,
        genre: decammed.genre,
        description: decammed.description,
        cover_url: decammed.cover_url
      }
      return knex('books')
        .where('id', req.params.id)
        .then((row) => {
          res.json(humps.camelizeKeys(newData))
        })
    })
})

module.exports = router;
