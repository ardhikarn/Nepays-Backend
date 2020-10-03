// const midtransClient = require('midtrans-client')
const connection = require('../config/mysql')

module.exports = {
  postTopup: (set_data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO topup_history SET ?', set_data, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  patchTopup: (id, set_data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET ? WHERE id = ?', [set_data, id], (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getBalanceUser: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT balance FROM users WHERE id = ?', id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  createPayment: (id_topup, nominal) => {
    return new Promise((resolve, reject) => {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: 'YOUR_SERVER_KEY',
        clientKey: 'YOUR_CLIENT_KEY'
      })
      const parameter = {
        transaction_details: {
          order_id: id_topup,
          gross_amount: nominal
        },
        credit_card: {
          secure: true
        }
      }

      snap.createTransaction(parameter)
        .then((transaction) => {
          console.log(transaction)
          resolve(transaction.redirect_url)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
    })
  }
}
