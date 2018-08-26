'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config')

const app = express()
const router = express.Router()

mongoose.connect(config.connectionString)

const Product = require('./models/product')
const Customer = require('./models/customer')
const Order = require('./models/order')

//carregar rotas
const index = require('./routes')
const products = require('./routes/products')
const customer = require('./routes/customer')
const order = require('./routes/order-routes')

app.use(bodyParser.json({//define um limite para a requisão em JSON
    limit: '5mb'
}))

app.use(bodyParser.urlencoded({ 
    extended:false 
}))

// Habilita o CORS
app.use(function (req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

app.use('/', index)
app.use('/products', products)
app.use('/customers', customer)
app.use('/orders', order)

module.exports = app