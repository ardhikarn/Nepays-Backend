const { getUserById } = require("../../model/profile")
const helper = require("../../helper/index")

module.exports = {

  get_profile_navbar: async (request, response) => {
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
  }

}
