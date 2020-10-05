const midtransClient = require('midtrans-client')
const connection = require('../config/mysql')

module.exports = {
  postTopup: (set_data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO topup_history SET ?', set_data, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getTopupHistory: (id, limit, offset) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM topup_history WHERE id_user = ? AND status = 1 LIMIT ? OFFSET ?', [id, limit, offset], (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  patchTopup: (id, set_data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET ? WHERE id = ?', [set_data, id], (error, result) => {
        console.log(error)
        console.log(result)
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getBalanceUser: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT balance FROM users WHERE id = ?', id, (error, result) => {
        console.log(error)
        console.log(result)
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getTopupHistoryCount: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT count(*) AS totals FROM topup_history WHERE id_user = ? AND status = 1', id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  createPayment: (topupId, nominal) => {
    return new Promise((resolve, reject) => {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: 'SB-Mid-server-xld1vMRItcFFCP8fqGwLHu4-',
        clientKey: 'SB-Mid-client-rpv3D01z-aeSbOOl'
      })

      const parameter = {
        transaction_details: {
          order_id: topupId,
          gross_amount: nominal
        },
        credit_card: {
          secure: true
        }
      }

      snap
        .createTransaction(parameter)
        .then((transaction) => {
          resolve(transaction.redirect_url)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getTopupById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM topup_history WHERE id = ?', id, (error, result) => {
        console.log(error)
        console.log(result)
        !error ? resolve(result[0]) : reject(new Error(error))
      })
    })
  },
  patchTopupHistory: (id, setData) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE topup_history SET ? WHERE id = ?', [setData, id], (error, result) => {
        console.log(error)
        console.log(result)
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  }
}
