const bcrypt = require('bcrypt')
const helper = require('../helper')
const { getUserByEmail, getUserByPhone, postUser } = require('../model/user')

module.exports = {
  registerUser: async (request, response) => {
    const { firstName, lastName, email, phone, password } = request.body
    const salt = bcrypt.genSaltSync(9)
    const encryptPassword = bcrypt.hashSync(password, salt)
    const checkEmail = await getUserByEmail(email)
    const checkPhone = await getUserByPhone(phone)
    const setData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      pin_code: '',
      password: encryptPassword,
      image: 'blank-user.png',
      balance: 0,
      status: 1,
      reset_key: 0,
      created: new Date()
    }
    try {
      if (firstName === undefined || firstName === '') {
        return helper.response(response, 400, 'Please enter your first name')
      } else if (lastName === undefined || lastName === '') {
        return helper.response(response, 400, 'Please enter your last name')
      } else if (email === undefined || email === '') {
        return helper.response(response, 400, 'Please enter your email')
      } else if (checkEmail.length > 0) {
        return helper.response(response, 400, 'Email is already registered')
      } else if (phone === undefined || phone === '') {
        return helper.response(response, 400, 'Please enter your phone number')
      } else if (checkPhone.length > 0) {
        return helper.response(response, 400, 'Phone number is already registered')
      } else if (phone.length < 10 || phone.length > 13) {
        return helper.response(response, 400, 'Invalid phone number')
      } else if (password === undefined || password === '') {
        return helper.response(response, 400, 'Please enter a password')
      } else if (password.length < 8 || password.length > 16) {
        return helper.response(response, 400, 'Password must be 8-16 characters length')
      } else {
        await postUser(setData)
        return helper.response(response, 200, 'Registration Successful')
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  }
}
