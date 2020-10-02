const router = require('express').Router()

const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controller/user')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/forgot', forgotPassword)

router.patch('/reset', resetPassword)

module.exports = router
