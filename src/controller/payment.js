const helper = require('../helper/index')
const { getBalanceUser, postTopup, patchTopup, getTopupHistory, getTopupHistoryCount, createPayment, getTopupById, patchTopupHistory } = require('../model/payment')
const { postNotification } = require('../model/notification')
const midtransClient = require('midtrans-client')
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
  createPayment: async (request, response) => {
    try {
      const { id } = request.params
      const { nominal } = request.body
      const setData = {
        id_user: id,
        nominal,
        status: 0,
        date: new Date()
      }
      const postHistory = await postTopup(setData)
      const topupId = postHistory.insertId
      const topUp = await createPayment(topupId, nominal)
      return helper.response(response, 200, 'Success Create Payment !', topUp)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  midtransNotification: async (request, response) => {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: 'SB-Mid-server-xld1vMRItcFFCP8fqGwLHu4-',
      clientKey: 'SB-Mid-client-rpv3D01z-aeSbOOl'
    })

    snap.transaction.notification(request.body).then((statusResponse) => {
      const orderId = statusResponse.order_id
      const transactionStatus = statusResponse.transaction_status
      const fraudStatus = statusResponse.fraud_status

      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      )

      if (transactionStatus === 'capture') {
        if (fraudStatus === 'challenge') {
          // TODO set transaction status on your databaase to 'challenge'
          console.log('challenge')
        } else if (fraudStatus === 'accept') {
          // TODO set transaction status on your databaase to 'success'
          console.log('success')
        }
      } else if (transactionStatus === 'settlement') {
        const checkTopup = getTopupById(orderId)
        const setDataStatus = {
          status: 1
        }
        patchTopupHistory(orderId, setDataStatus)
        const balance = getBalanceUser(checkTopup[0].id_user)
        const addition = balance[0].balance + checkTopup[0].nominal
        const setDataBalance = {
          balance: addition,
          updated: new Date()
        }
        patchTopup(checkTopup[0].id_user, setDataBalance)
        // return helper.response(response, 200, 'Topup Success')
      } else if (transactionStatus === 'deny') {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        console.log('deny')
      } else if (
        transactionStatus === 'cancel' ||
        transactionStatus === 'expire'
      ) {
        // TODO set transaction status on your databaase to 'failure'
        console.log('failure')
      } else if (transactionStatus === 'pending') {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        console.log('pending')
      }
    }).then(() => {
      return helper.response(response, 200, 'OK')
    })
      .catch((error) => {
        return helper.response(response, 200, error)
      })
  },
  test: async (request, response) => {
    try {
      const { id } = request.params
      const checkTopup = await getTopupById(id)
      const setDataStatus = {
        status: 1
      }
      await patchTopupHistory(id, setDataStatus)
      const balance = await getBalanceUser(checkTopup.id_user)
      const addition = balance[0].balance + checkTopup.nominal
      const setDataBalance = {
        balance: addition,
        updated: new Date()
      }
      await patchTopup(checkTopup.id_user, setDataBalance)
      const setDataNotification = {
        user_id: checkTopup.id_user,
        message: 'Top up',
        amount: checkTopup.nominal,
        category: 2,
        status: 0,
        created_at: new Date()
      }
      await postNotification(setDataNotification)
      return helper.response(response, 200, 'Topup Success')
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  },
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
    const limit = 4
    const totalData = await getTopupHistoryCount(id_user_login)
    const totalPage = Math.ceil(totalData[0].totals / limit)
    const offset = page * limit - limit
    const prevLink = getPrevLink(page, request.query)
    const nextLink = getNextLink(page, totalPage, request.query)
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
