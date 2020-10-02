const { patchNewPin, GetUserPin } = require('../../model/pin')
const helper = require('../../helper/index')
const bcrypt = require('bcrypt')

module.exports = {

  patch_new_pin: async (request, response) => { // New pin
    try {
      const id = request.params.id
      const pin = request.body.pin
      const pin_confirm = request.body.pin_confirm
      const salt = bcrypt.genSaltSync(10)
      const pin_encrypt = bcrypt.hashSync(pin_confirm, salt)
      const setData = { pin_code: pin_encrypt }

      if (pin === pin_confirm) {
        if (pin_confirm.length < 6) {
          return helper.response(response, 400, 'Pin must be up to 6 number')
        } else if (pin_confirm.length > 6) {
          return helper.response(response, 400, 'Max Pin 6 number')
        } else {
          await patchNewPin(setData, id)
          return helper.response(response, 200, 'Create new pin success')
        }
      } else {
        return helper.response(response, 200, "Pin doesn't match", pin)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad request', error)
    }
  },
  patch_edit_pin: async (request, response) => { // Edit pin
    try {
      const id = request.params.id
      const pin_new = request.body.pin_new
      const pin_confirm = request.body.pin_confirm
      const pin_last_input = request.body.pin_last
      const pin_last_user = await GetUserPin(id)
      const pin_check = bcrypt.compareSync(pin_last_input, pin_last_user[0].pin_code)
      const salt = bcrypt.genSaltSync(10)
      const pin_encrypt = bcrypt.hashSync(pin_confirm, salt)
      const setData = { pin_code: pin_encrypt }
      if (pin_check === true) {
        if (pin_new === pin_confirm) {
          if (pin_confirm.length < 6) {
            return helper.response(response, 400, 'Pin must be up to 6 number')
          } else if (pin_confirm.length > 6) {
            return helper.response(response, 400, 'Max Pin 6 number')
          } else {
            await patchNewPin(setData, id)
            return helper.response(response, 200, 'Create new pin success')
          }
        } else {
          return helper.response(response, 400, "Pin doesn't match")
        }
      } else {
        return helper.response(response, 400, 'Wrong Pin !')
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  }

}
