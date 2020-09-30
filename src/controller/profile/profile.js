const { getUserById, getUserFullById } = require("../../model/profile")
const helper = require("../../helper/index")

module.exports = {

  get_profile: async (request, response) => {
    try {
      const { id_user_login } = request.body
      const result = await getUserById(id_user_login)
      if (result.length > 0) {
        return helper.response(response, 200, "Get Profile success", result);
      } else {
        return helper.response(response, 404, "Please Login");
      }
    } catch (error) {
      return helper.response(response, 400, "Bad request", error);
    }
  },
  get_personal: async (request, response) => {
    try {
      const { id_user_login } = request.body
      const result = await getUserFullById(id_user_login)
      if (result.length > 0) {
        return helper.response(response, 200, "Get Personal success", result);
      } else {
        return helper.response(response, 404, "Please Login");
      }
    } catch (error) {
      return helper.response(response, 400, "Bad request", error);
    }
  }

}
