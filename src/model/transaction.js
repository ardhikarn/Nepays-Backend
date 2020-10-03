const connection = require('../config/mysql')

module.exports = {
  getRecentTransactionById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT users.first_name, users.last_name, users.image, transaction.amount, transaction.category, transaction.created FROM transaction JOIN users ON transaction.target_id = users.id WHERE transaction.user_id = ? ORDER BY transaction.created DESC LIMIT 4', id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getTransactionHistory: (id, time, offset) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT users.first_name, users.last_name, users.image, transaction.amount, transaction.category, transaction.created FROM transaction JOIN users ON transaction.target_id = users.id WHERE transaction.user_id = ? AND ${time} AND YEAR(transaction.created) = YEAR(NOW()) ORDER BY transaction.created DESC LIMIT 3 OFFSET ?`, [id, offset], (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getCountTransactionHistory: (id, time) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT COUNT(*) as total FROM transaction JOIN users ON transaction.target_id = users.id WHERE transaction.user_id = ? AND ${time} AND YEAR(transaction.created) = YEAR(NOW()) ORDER BY transaction.created DESC`, id, (error, result) => {
        !error ? resolve(result[0].total) : reject(new Error(error))
      })
    })
  },
  getSearchTransactionHistory: (id, keyword, offset) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT users.first_name, users.last_name, users.image, transaction.amount, transaction.category, transaction.created FROM transaction JOIN users ON transaction.target_id = users.id WHERE transaction.user_id = ? AND users.first_name LIKE ? OR users.last_name LIKE ? ORDER BY transaction.created DESC LIMIT 3 OFFSET ?', [id, `%${keyword}%`, `%${keyword}%`, offset], (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getCountSearchHistory: (id, keyword) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT COUNT(*) as total FROM transaction JOIN users ON transaction.target_id = users.id WHERE transaction.user_id = ? AND users.first_name LIKE ? OR users.last_name LIKE ? ORDER BY transaction.created DESC', [id, `%${keyword}%`, `%${keyword}%`], (error, result) => {
        !error ? resolve(result[0].total) : reject(new Error(error))
      })
    })
  },
  postTransaction: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO transaction SET ?', setData, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  }
}
