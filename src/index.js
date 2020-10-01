const route = require('express').Router()

// Route
const user = require('./routes/user')
const payment = require('./routes/payment')

// Middle
route.use('/user/', user)
route.use('/payment', payment)

module.exports = route
