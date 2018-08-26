'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/customer-controller')
const auth = require('../service/auth')

router.post('/', controller.post) 
router.post('/authenticate', controller.authenticate) 
router.post('/refresh-token', auth.authorize, controller.refreshToken) 

module.exports = router