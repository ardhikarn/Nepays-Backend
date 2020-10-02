const router = require('express').Router()

const { recentTransaction, transactionHistory, searchTransactionHistory } = require('../controller/transaction')

router.get('/recent/:id', recentTransaction)
router.get('/history', transactionHistory)
router.get('/search', searchTransactionHistory)

module.exports = router
