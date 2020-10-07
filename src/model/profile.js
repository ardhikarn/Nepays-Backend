const connection = require('../config/mysql')

module.exports = {
  getUserFullById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT id, first_name, last_name, email, phone, (CASE WHEN image = '' THEN 'blank-user.png' ELSE image END) AS image, status, created, balance, reset_key FROM users WHERE id = ?", id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getPhone: (phone) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT phone FROM users WHERE phone = ?', phone, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getImage: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT id, image FROM users WHERE id = ?', id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  patchPersonal: (id, setData) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET ? WHERE id = ?', [setData, id], (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  patchProfileImage: (id, setData) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET ? WHERE id = ?', [setData, id], (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  }

}
