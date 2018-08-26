'use strict'

const express = require('express')
const router = express.Router()

const route = router.get('/', (req, res, next) => {
    res.status(200).send({
        titlle: "Node Satore Api",
        version: "0.0.2"
    })
})

module.exports = router