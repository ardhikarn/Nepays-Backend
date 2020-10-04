const connection = require('../config/mysql')

module.exports = {

  getUsersSearch: (id, search, limit, offset) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM users WHERE id != ? AND first_name LIKE '%${search}%' OR last_name LIKE '%${search}%' LIMIT ? OFFSET ?`, [id, limit, offset], (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getUsersCount: () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT count(*) AS total_user FROM users`, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getUsersId: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM users WHERE id = ?`, id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  }

}
