const helper = require('../helper')
const qs = require('querystring')
const bcrypt = require('bcrypt')
const { getRecentTransactionById, getTransactionHistory, getCountTransactionHistory, getCountSearchHistory, getSearchTransactionHistory, postTransaction, getSum, getDailySum } = require('../model/transaction')
const { getUserById, patchUserByEmail } = require('../model/user')

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
  },
  transfer: async (request, response) => {
    const { userId, targetId, amount, note, pin } = request.body
    try {
      const checkUser = await getUserById(userId)
      const deduction = checkUser.balance - amount
      if (deduction < 0) {
        return helper.response(response, 400, 'Insufficient balance')
      } else {
        const checkPin = bcrypt.compareSync(pin, checkUser.pin_code)
        if (!checkPin) {
          return helper.response(response, 400, 'Your pin is incorrect')
        } else {
          const setDataUser = {
            balance: deduction,
            updated: new Date()
          }
          await patchUserByEmail(setDataUser, checkUser.email)
          const checkTarget = await getUserById(targetId)
          const addition = parseInt(checkTarget.balance) + parseInt(amount)
          const setDataTarget = {
            balance: addition,
            updated: new Date()
          }
          await patchUserByEmail(setDataTarget, checkTarget.email)
          const setDataSend = {
            user_id: userId,
            target_id: targetId,
            amount,
            category: 1,
            note,
            created: new Date()
          }
          await postTransaction(setDataSend)
          const setDataReceive = {
            user_id: targetId,
            target_id: userId,
            amount,
            category: 2,
            note,
            created: new Date()
          }
          await postTransaction(setDataReceive)
          const result = {
            amount,
            balanceLeft: deduction,
            date: new Date(),
            note,
            transferTo: {
              image: checkTarget.image,
              name: checkTarget.first_name.concat(' ', checkTarget.last_name),
              phone: checkTarget.phone
            }
          }
          return helper.response(response, 200, 'Transfer Success', result)
        }
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  chart: async (request, response) => {
    const { id } = request.params
    try {
      const income = await getSum(id, 2)
      const expense = await getSum(id, 1)
      const dailyIncome = await getDailySum(id, 2)
      const dailyExpense = await getDailySum(id, 1)
      const result = {
        income,
        expense,
        chartData: {
          dailyIncome,
          dailyExpense
        }
      }
      return helper.response(response, 200, 'Get chart data success', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
