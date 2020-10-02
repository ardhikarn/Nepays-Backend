const { patchNewPassword, GetUserPin } = require("../../model/pin")
const helper = require("../../helper/index")
const bcrypt = require('bcrypt')
const { request } = require("express")

module.exports = {

  patch_edit_password: async (request, response) => {
    try {
      const id = request.params.id
      const password_new = request.body.password_new
      const password_confirm = request.body.password_confirm
      const password_input = request.body.password_last
      const password_last_user = await GetUserPin(id)
      const password_check = bcrypt.compareSync(password_input, password_last_user[0].password)
      const salt = bcrypt.genSaltSync(10)
      const password_encrypt = bcrypt.hashSync(password_confirm, salt)
      const setData = { password: password_encrypt }
      if (password_check === true) {
        if (password_new === password_confirm) {
          if (password_confirm.length < 8 || password_confirm.lenght > 16) {
            return helper.response(response, 400, "Password must be 8-16 character");
          } else {
            const new_password = await patchNewPassword(setData, id)
            return helper.response(response, 200, "Update password success");
          }
        } else {
          return helper.response(response, 400, "Password doesn't match");
        }
      } else {
        return helper.response(response, 400, "Wrong Password !");
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request");
    }
  }

}
