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
  },
  patchUserByEmail: (setData, email) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET ? WHERE email = ?', [setData, email], (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getUserByKey: (key) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE reset_key = ?', key, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * from users WHERE id = ?', id, (error, result) => {
        !error ? resolve(result[0]) : reject(new Error(error))
      })
    })
  }
}
