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
        if (pin_confirm.length < 6 || pin_confirm.length > 6) {
          return helper.response(response, 400, 'Pin must be 6 digit number')
        } else {
          await patchNewPin(setData, id)
          return helper.response(response, 200, 'Add new pin success')
        }
      } else {
        return helper.response(response, 200, "Pin didn't match", pin)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad request', error)
    }
  },
  patch_edit_pin: async (request, response) => {
    try {
      const id = request.params.id
      const pin_new = request.body.pin_new
      const pin_last_input = request.body.pin_last
      const pin_last_user = await GetUserPin(id)
      const pin_check = bcrypt.compareSync(pin_last_input, pin_last_user[0].pin_code)
      const salt = bcrypt.genSaltSync(10)
      const pin_encrypt = bcrypt.hashSync(pin_new, salt)
      const setData = { pin_code: pin_encrypt }
      if (pin_check === true) {
        if (pin_new.length < 6 || pin_new.length > 6) {
          return helper.response(response, 400, 'Pin must be 6 digit number')
        } else {
          await patchNewPin(setData, id)
          return helper.response(response, 200, 'Change pin success')
        }
      } else {
        return helper.response(response, 400, 'Wrong pin')
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  }

}
