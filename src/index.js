const route = require('express').Router()

// Route
const user = require('./routes/user')

// Middle
route.use('/user/', user)

module.exports = route
