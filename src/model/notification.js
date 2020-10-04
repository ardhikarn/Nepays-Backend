const connection = require('../config/mysql')

module.exports = {
  postNotification: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO notification SET ?', setData, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getUnseenNotif: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT COUNT(*) AS unseen FROM notification WHERE user_id = ? AND status = 0', id, (error, result) => {
        !error ? resolve(result[0].unseen) : reject(new Error(error))
      })
    })
  },
  getNotificationById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM notification WHERE user_id = ? AND status = 0', id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  patchNotification: (id, setData) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE notification SET ? WHERE user_id = ?', [setData, id], (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  }
}
