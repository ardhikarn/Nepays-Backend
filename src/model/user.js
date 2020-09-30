const connection = require('../config/mysql')

module.exports = {
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE email = ?', email, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getUserByPhone: (phone) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE phone = ?', phone, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  postUser: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO users SET ?', setData, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  }
}
