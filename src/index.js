const route = require('express').Router()

// Route
const user = require('./routes/user')
const payment = require('./routes/payment')
const transaction = require('./routes/transaction')

// Middle
route.use('/user/', user)
route.use('/payment', payment)
route.use('/transaction', transaction)

module.exports = route
