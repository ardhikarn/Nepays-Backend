const router = require('express').Router()
const { postPayment, post_topup } = require('../controller/payment')

router.post('/', post_topup)
// router.post('/midtrans-notification', )

module.exports = router
