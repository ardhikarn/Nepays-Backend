const router = require('express').Router()

const { recentTransaction, transactionHistory } = require('../controller/transaction')

router.get('/recent/:id', recentTransaction)
router.get('/history', transactionHistory)

module.exports = router
