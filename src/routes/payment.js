const router = require('express').Router()
const { postPayment } = require('../controller/payment')

router.post('/', postPayment)
// router.post('/midtrans-notification', )

module.exports = router
