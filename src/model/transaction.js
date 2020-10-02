const connection = require('../config/mysql')

module.exports = {
  getRecentTransactionById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT users.first_name, users.last_name, users.image, transaction.amount, transaction.type, transaction.created FROM transaction JOIN users ON transaction.target_id = users.id WHERE transaction.user_id = ? ORDER BY transaction.created DESC LIMIT 4', id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getTransactionHistory: (id, time) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT users.first_name, users.last_name, users.image, transaction.amount, transaction.type, transaction.created FROM transaction JOIN users ON transaction.target_id = users.id WHERE transaction.user_id = ? AND ${time} AND YEAR(transaction.created) = YEAR(NOW()) ORDER BY transaction.created DESC LIMIT 3`, id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  }
}
