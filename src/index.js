const route = require('express').Router()

const user = require('./routes/user')
const profile = require('./routes/profile')
const pin = require('./routes/pin')
const password = require('./routes/password')

route.use('/user/', user)
route.use('/profile', profile)
route.use('/pin', pin)
route.use('/password_change', password)

module.exports = route
