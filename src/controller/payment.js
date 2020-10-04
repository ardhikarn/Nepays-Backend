const helper = require('../helper/index')
const { getBalanceUser, postTopup, patchTopup } = require('../model/payment')
const { postNotification } = require('../model/notification')

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
      const { id_user_login, nominal } = request.body
      const saldo_user = await getBalanceUser(id_user_login)
      const set_data = { id_user: id_user_login, nominal: nominal, date: new Date() }
      const set_data_2 = { balance: parseInt(saldo_user[0].balance) + parseInt(nominal) }
      const post_history = await postTopup(set_data)
      const patch_user = await patchTopup(id_user_login, set_data_2)
      const setDataNotification = {
        user_id: id_user_login,
        message: 'Top up',
        amount: nominal,
        category: 2,
        status: 0,
        created_at: new Date()
      }
      await postNotification(setDataNotification)
      return helper.response(response, 200, 'Success Topup')
    } catch (error) {
      console.log(error)
    }
  }
}
