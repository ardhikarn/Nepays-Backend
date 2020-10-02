const helper = require('../helper')
const qs = require('querystring')
const { getRecentTransactionById, getTransactionHistory, getCountTransactionHistory, getCountSearchHistory, getSearchTransactionHistory } = require('../model/transaction')

const getPrevLink = (page, currentQuery) => {
  if (page > 1) {
    const generatePage = {
      page: page - 1
    }
    const resultPrevLink = { ...currentQuery, ...generatePage }
    return qs.stringify(resultPrevLink)
  } else {
    return null
  }
}

const getNextLink = (page, totalPage, currentQuery) => {
  if (page < totalPage) {
    const generatePage = {
      page: page + 1
    }
    const resultPrevLink = { ...currentQuery, ...generatePage }
    return qs.stringify(resultPrevLink)
  } else {
    return null
  }
}

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
    let { id, span, page } = request.query
    page === undefined || page === '' ? (page = 1) : (page = parseInt(page))
    const limit = 3
    try {
      let timeSql = null
      if (span === 'week') {
        timeSql = 'WEEK(transaction.created) = WEEK(NOW())'
      } else if (span === 'month') {
        timeSql = 'MONTH(transaction.created) = MONTH(NOW())'
      } else if (span === 'year') {
        timeSql = 'YEAR(transaction.created) = YEAR(NOW())'
      }
      const totalData = await getCountTransactionHistory(id, timeSql)
      const totalPage = Math.ceil(totalData / limit)
      const offset = page * limit - limit
      const prevLink = getPrevLink(page, request.query)
      const nextLink = getNextLink(page, totalPage, request.query)
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
        prevLink: prevLink && `http://${process.env.IP}:${process.env.PORT}/transaction/history?${prevLink}`,
        nextLink: nextLink && `http://${process.env.IP}:${process.env.PORT}/transaction/history?${nextLink}`
      }
      const result = await getTransactionHistory(id, timeSql, offset)
      return helper.response(response, 200, 'Get transaction history successfully', result, pageInfo)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  searchTransactionHistory: async (request, response) => {
    let { id, keyword, page } = request.query
    page === undefined || page === '' ? (page = 1) : (page = parseInt(page))
    const limit = 3
    try {
      const totalData = await getCountSearchHistory(id, keyword)
      const totalPage = Math.ceil(totalData / limit)
      const offset = page * limit - limit
      const prevLink = getPrevLink(page, request.query)
      const nextLink = getNextLink(page, totalPage, request.query)
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
        prevLink: prevLink && `http://${process.env.IP}:${process.env.PORT}/transaction/search?${prevLink}`,
        nextLink: nextLink && `http://${process.env.IP}:${process.env.PORT}/transaction/search?${nextLink}`
      }
      const result = await getSearchTransactionHistory(id, keyword, offset)
      return helper.response(response, 200, 'Search transaction history successfully', result, pageInfo)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
