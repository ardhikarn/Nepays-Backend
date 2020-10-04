const helper = require('../helper')
const { getUnseenNotif, getNotificationById, patchNotification } = require('../model/notification')

module.exports = {
  getNotification: async (request, response) => {
    const { id } = request.params
    try {
      const unseen = await getUnseenNotif(id)
      const notifications = await getNotificationById(id)
      const result = {
        unseen,
        notifications
      }
      return helper.response(response, 200, 'Get notification success', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  clickNotification: async (request, response) => {
    const { id } = request.params
    try {
      const setData = {
        status: 1
      }
      await patchNotification(id, setData)
      return helper.response(response, 200, 'Notification seen')
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
