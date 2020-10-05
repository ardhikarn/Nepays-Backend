const helper = require('../helper/index')
const { getBalanceUser, postTopup, patchTopup, getTopupHistory, getTopupHistoryCount } = require('../model/payment')
const { postNotification } = require('../model/notification')
// const connection = require('../config/mysql')
const qs = require('querystring')

const getPrevLink = (page, currentQuery) => {
  if (page > 1) {
    const generatedPage = { page: page - 1 }
    const resultPrevLink = { ...currentQuery, ...generatedPage }
    return qs.stringify(resultPrevLink)
  } else {
    return null
  }
}
const getNextLink = (page, totalPage, currentQuery) => {
  if (page < totalPage) {
    const generatedPage = { page: page + 1 }
    const resultNextLink = { ...currentQuery, ...generatedPage }
    return qs.stringify(resultNextLink)
  } else {
    return null
  }
}

module.exports = {
  // postPayment: async (request, response) => {
  //   try {
  // [model 1] proses save data to database: userid, nominal, created_at
  // berhasil simpan ke table topup response : topupId, userid, nominal, created_at
  // [model 2] update data saldo supaya saldo si user bertambah
  // ==============================================================================
  // [model 1] proses save data to database: userid, nominal, status, created_at
  // berhasil simpan ke table topup response : topupId, userid, nominal, status, created_at
  //   const { id_topup, nominal } = request.body
  //   const topUp = await createPayment(id_topup, nominal)
  //   return helper.response(response, 200, 'Success Create Payment', topUp)
  // } catch (error) {
  //   return helper.response(response, 400, 'Bad Request', error)
  // }
  // },
  post_topup: async (request, response) => {
    try {
      const { id } = request.params
      const { nominal } = request.body
      // const { id_user_login, nominal } = request.body
      const saldo_user = await getBalanceUser(id)
      const set_data = { id_user: id, nominal: nominal, date: new Date() }
      const set_data_2 = { balance: parseInt(saldo_user[0].balance) + parseInt(nominal) }
      const post_history = await postTopup(set_data)
      const patch_user = await patchTopup(id, set_data_2)
      const setDataNotification = {
        user_id: id,
        message: 'Top up',
        amount: nominal,
        category: 2,
        status: 0,
        created_at: new Date()
      }
      await postNotification(setDataNotification)
      return helper.response(response, 200, 'Success Topup')
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  },
  get_topup_history: async (request, response) => {
    let { page, id_user_login } = request.query
    page = parseInt(page)
    let limit = 4
    let totalData = await getTopupHistoryCount(id_user_login)
    let totalPage = Math.ceil(totalData[0].totals / limit)
    let offset = page * limit - limit
    let prevLink = getPrevLink(page, request.query)
    let nextLink = getNextLink(page, totalPage, request.query)
    const pageInfo = {
      page,
      totalPage,
      limit,
      totalData,
      prevLink: prevLink && `${process.env.ip}:${process.env.port}/payment?${prevLink}`,
      nextLink: nextLink && `${process.env.ip}:${process.env.port}/payment?${nextLink}`
    }
    try {
      const data = await getTopupHistory(id_user_login, limit, offset)
      return helper.response(response, 200, 'Get History success', data, pageInfo)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  }
}
