const router = require('express').Router()

const { registerUser } = require('../controller/user')

router.post('/register', registerUser)

module.exports = router
