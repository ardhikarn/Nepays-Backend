const router = require('express').Router()
const { createPayment, midtransNotification, post_topup, get_topup_history, test } = require('../controller/payment')

router.post('/', post_topup)
router.get('/', get_topup_history)

router.post('/midtrans/:id', createPayment)
router.post('/midtrans/notification', midtransNotification)
router.post('/midtrans/test/:id', test)

module.exports = router
