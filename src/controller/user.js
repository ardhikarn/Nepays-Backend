const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
  },
  loginUser: async (request, response) => {
    const { email, password } = request.body
    try {
      if (email === undefined || email === '') {
        return helper.response(response, 400, 'Please enter your email')
      } else if (password === undefined || password === '') {
        return helper.response(response, 400, 'Please enter your password')
      } else {
        const checkUser = await getUserByEmail(email)
        if (checkUser.length < 1) {
          return helper.response(response, 400, 'Email is not registered')
        } else {
          const checkPassword = bcrypt.compareSync(password, checkUser[0].password)
          if (!checkPassword) {
            return helper.response(response, 400, 'Wrong password')
          } else {
            let payload = {
              id: checkUser[0].id,
              first_name: checkUser[0].first_name,
              last_name: checkUser[0].last_name,
              email: checkUser[0].email,
              phone: checkUser[0].phone,
              pin_code: checkUser[0].pin_code,
              image: checkUser[0].image,
              balance: checkUser[0].balance,
              status: checkUser[0].status
            }
            if (payload.status === 0) {
              return helper.response(response, 400, 'Account is not activated, please check your email')
            } else {
              const token = jwt.sign(payload, process.env.KEY, { expiresIn: '24h' })
              payload = { ...payload, token }
              return helper.response(response, 200, 'Login Success', payload)
            }
          }
        }
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  }
}
