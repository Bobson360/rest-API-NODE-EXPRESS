'use strict'

const repository = require('../repositories/order-repository')
const guid = require('guid')
const auth = require('../service/auth')

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get()
        res.status(200).send(data)
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        })
    }
}

exports.post = async (req, res, next) => {
    try {
        // Recupera o Token
        const token = req.body.token || req.query.token || req.headers['x-access-token']

        //Decodifica o token
        const data = await auth.decodeToken(token)

        await repository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        })
        console.log(data.id)
        res.status(201).send({
            message: 'pedido cadastrado com sucesso'
        })
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        })
    }
}