const connection = require("../config/mysql");

module.exports = {

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT first_name, last_name, phone, (CASE WHEN image = '' THEN 'blank-user.png' ELSE image END) AS image FROM users WHERE id = ?", id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  }

}
