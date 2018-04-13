'use strict';

const express = require('express');
const knex = require('../knex.js')
// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.get('/books', (req, res, next) => {
  knex.column('author', 'cover_url as coverUrl', 'updated_at as updatedAt', 'created_at as createdAt', 'description', 'genre', 'id', 'title').select()
    .from('books')
    .orderBy('title', 'asc')
    .then((result) => {
      res.send(result)
    })
  // next({error: 'Error 404'}
})

router.get('/books/:id', (req, res, next) => {
  let id = req.params.id
  knex.column('author', 'cover_url as coverUrl', 'updated_at as updatedAt', 'created_at as createdAt', 'description', 'genre', 'id', 'title').select()
    .from('books')
    .where('books.id', id)
    .then(result => {
      res.send(result[0])
    })
})

router.post('/books', (req, res, next) => {
  knex('books').insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl,
    }, '*')
    .returning(['id', 'title', 'author', 'genre', 'cover_url as coverUrl', 'description'])
    .then(result => {
      res.status(200).send(result[0])
    })
    .catch((err) => {
      next(err)
    })
})

router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .where({
      id: req.params.id
    })
    .update({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl,
    }, '*')
    .returning(['id', 'title', 'author', 'genre', 'cover_url as coverUrl', 'description'])
    .then((result) => {
      res.status(200).send(result[0])
    })
})

router.delete('/books/:id', (req, res, next) => {
  return knex('books')
    .where({
      id: req.params.id
    })
    .del()
    .returning(['title', 'author', 'genre', 'cover_url as coverUrl', 'created_at AS createdAt', 'description'])
    .then((data) => {
      res.status(200).send(data[0])
    })
})




module.exports = router;
