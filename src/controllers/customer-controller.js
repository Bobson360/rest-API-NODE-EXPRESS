'use strict'

const ValidationContract = require('../validators/fluent-validators')
const repository = require('../repositories/customer-repository')
const md5 = require('md5')
const emailService = require('../service/email-service')
const authService = require('../service/auth')


exports.post = async (req, res, next) => {

    let contract = new ValidationContract()
    contract.hasMinLen(req.body.name, 3, 'o nome deve conter pelo menos 3 caracteres')
    contract.isEmail(req.body.email, 'Email invalido')
    contract.hasMinLen(req.body.password, 3, 'a senha deve conter pelo menos 3 caracteres')

    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end()
        return
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles:["user"]
        })

        emailService.send(
            req.body.email, 'Bem vindo ao Node Store', global.EMAIL_TMPL.replace('{0}', req.body.name))

        res.status(201).send({
            message: 'Cliente cadastrado com sucesso'
        })
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        })
    }
}

exports.authenticate = async (req, res, next) => {
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        })
        console.log(customer)
        if (!customer) {
            res.status(404).send({
                message: 'usuario ou senha ivalido'
            })
        }

        const token = await authService.generateToken({
            id: customer.id,
            email: customer.email,
            name: customer.name,
            roles:customer.roles
        })

        res.status(201).send({
            token: token,
            data: {
                email: req.body.email,
                name: req.body.name
            }
        })
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        })
    }
}

exports.refreshToken = async (req, res, next) => {
    try {
         // Recupera o Token
         const token = req.body.token || req.query.token || req.headers['x-access-token']
        console.log(token)
         //Decodifica o token
         const data = await authService.decodeToken(token)
        console.log('data')
        const customer = await repository.getById(data.id)
        console.log(customer)
        if (!customer) {
            res.status(404).send({
                message: 'cliente não encontrado'
            })
        }

        const tokenData = await authService.generateToken({
            id: customer.id,
            email: customer.email,
            name: customer.name,
            roles:customer.roles
        })

        res.status(201).send({
            token: tokenData,
            data: {
                email: req.body.email,
                name: req.body.name
            }
        })
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        })
    }
}