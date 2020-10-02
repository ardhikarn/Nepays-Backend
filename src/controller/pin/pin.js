const { patchNewPin, GetUserPin } = require("../../model/pin")
const helper = require("../../helper/index")
const bcrypt = require('bcrypt')
const { request } = require("express")

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
          return helper.response(response, 400, "Pin must be up to 6 number");
        } else if (pin_confirm.length > 6) {
          return helper.response(response, 400, "Max Pin 6 number");
        } else {
          const new_pins = await patchNewPin(setData, id)
          return helper.response(response, 200, "Create new pin success");
        }
      } else {
        return helper.response(response, 200, "Pin doesn't match", pin);
      }
    } catch (error) {
      return helper.response(response, 400, "Bad request", error);
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
            return helper.response(response, 400, "Pin must be up to 6 number");
          } else if (pin_confirm.length > 6) {
            return helper.response(response, 400, "Max Pin 6 number");
          } else {
            const new_pins = await patchNewPin(setData, id)
            return helper.response(response, 200, "Create new pin success");
          }
        } else {
          return helper.response(response, 400, "Pin doesn't match");
        }
      } else {
        return helper.response(response, 400, "Wrong Pin !");
      }
      // const setData = { pin_code: pin_encrypt }
      // if (pin.length < 6) {
      //   return helper.response(response, 400, "Pin must be up to 6 number");
      // } else if (pin.length >= 6) {
      //   return helper.response(response, 400, "Max Pin 6 number");
      // } else {
      //   const check_pin = bcrypt.compareSync(pin, LastPin[0].pin)
      //   console.log(check_pin)
      //   // const new_pin = await patchNewPin(setData, id)
      //   return helper.response(response, 200, "Create new pin success");
      // }

      // const check_password = bcrypt.compareSync(password, check_data_user[0].password)
      // if (check_password) {
      //   const { id, email, name, role_id, status } = check_data_user[0]
      //   let payload = {
      //     id,
      //     email,
      //     name,
      //     role_id,
      //     status
      //   }
      //   const token = jwt.sign(payload, "RAHASIA", { expiresIn: "300h" })
      //   payload = { ...payload, token }
      //   return helper.response(response, 200, "Login Success", payload)
      // } else {
      //   return helper.response(response, 400, "Wrong Password !")
      // }
    } catch (error) {

    }
  }

}
