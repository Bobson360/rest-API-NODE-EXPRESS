'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/product-controller')
const auth = require('../service/auth')

router.get('/', controller.get)
router.get('/:slug', controller.getBySlug)
router.get('/admin/:id', controller.getById)
router.get('/tags/:tag', controller.getByTag)
router.post('/', auth.isAdmin, controller.post) 
router.put('/:id', auth.isAdmin, controller.put)
router.delete('/', auth.isAdmin, controller.delete)

module.exports = router