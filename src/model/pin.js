const connection = require('../config/mysql')

module.exports = {

  patchNewPin: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET ? WHERE id = ?', [setData, id], (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  GetUserPin: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT pin_code, password FROM users WHERE id = ?', id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  patchNewPassword: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET ? WHERE id = ?', [setData, id], (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  }

}
