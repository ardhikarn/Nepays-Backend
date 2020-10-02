const helper = require('../helper')
const { createPayment } = require('../model/payment')

module.exports = {
  postPayment: async (request, response) => {
    try {
      // [model 1] proses save data to database: userid, nominal, created_at
      // berhasil simpan ke table topup response : topupId, userid, nominal, created_at
      // [model 2] update data saldo supaya saldo si user bertambah
      // ==============================================================================
      // [model 1] proses save data to database: userid, nominal, status, created_at
      // berhasil simpan ke table topup response : topupId, userid, nominal, status, created_at
      const { id_topup, nominal } = request.body
      const topUp = await createPayment(id_topup, nominal)
      return helper.response(response, 200, 'Success Create Payment', topUp)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
