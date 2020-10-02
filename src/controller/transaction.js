const helper = require('../helper')
const { getRecentTransactionById, getTransactionHistory } = require('../model/transaction')

module.exports = {
  recentTransaction: async (request, response) => {
    const { id } = request.params
    try {
      const result = await getRecentTransactionById(id)
      return helper.response(response, 200, 'Get recent transaction successfully', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  transactionHistory: async (request, response) => {
    const { id, span } = request.query
    try {
      let timeSql = null
      if (span === 'week') {
        timeSql = 'WEEK(transaction.created) = WEEK(NOW())'
      } else if (span === 'month') {
        timeSql = 'MONTH(transaction.created) = MONTH(NOW())'
      } else if (span === 'year') {
        timeSql = 'YEAR(transaction.created) = YEAR(NOW())'
      }
      const result = await getTransactionHistory(id, timeSql)
      return helper.response(response, 200, 'Get transaction history successfully', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
