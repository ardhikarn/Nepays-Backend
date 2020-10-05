const router = require('express').Router()
const { postPayment, post_topup, get_topup_history } = require('../controller/payment')

router.post('/', post_topup)
router.get('/', get_topup_history)
// router.post('/midtrans-notification', )

module.exports = router
