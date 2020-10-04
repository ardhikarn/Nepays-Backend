const route = require('express').Router()

const user = require('./routes/user')
const profile = require('./routes/profile')
const pin = require('./routes/pin')
const password = require('./routes/password')
const payment = require('./routes/payment')
const transaction = require('./routes/transaction')
const transfer = require('./routes/transfer')
const notification = require('./routes/notification')

route.use('/user/', user)
route.use('/profile', profile)
route.use('/pin', pin)
route.use('/password_change', password)
route.use('/payment', payment)
route.use('/transaction', transaction)
route.use('/transfer', transfer)
route.use('/notification', notification)

module.exports = route
