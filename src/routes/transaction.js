const router = require('express').Router()

const { recentTransaction, transactionHistory, searchTransactionHistory, transfer } = require('../controller/transaction')

router.get('/recent/:id', recentTransaction)
router.get('/history', transactionHistory)
router.get('/search', searchTransactionHistory)

router.post('/transfer', transfer)

module.exports = router
