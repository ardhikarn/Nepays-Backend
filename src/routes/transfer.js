const router = require('express').Router()

const { get_user } = require('../controller/transfer/transfer')

router.get('/', get_user)

module.exports = router
