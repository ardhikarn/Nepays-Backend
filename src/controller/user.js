const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('../helper')
const nodemailer = require('nodemailer')
const { getUserByEmail, getUserByPhone, postUser, patchUserByEmail, getUserByKey } = require('../model/user')

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
      return helper.response(response, 400, 'Bad Request', error)
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
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  forgotPassword: async (request, response) => {
    const { email } = request.body
    const key = Math.round(Math.random() * 100000)
    try {
      if (email === undefined || email === '') {
        return helper.response(response, 400, 'Please enter your email')
      } else {
        const checkUser = await getUserByEmail(email)
        if (checkUser.length < 1) {
          return helper.response(response, 400, 'Email is not registered !')
        } else {
          const setData = {
            reset_key: key,
            updated: new Date()
          }
          await patchUserByEmail(setData, email)
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: process.env.USER,
              pass: process.env.PASS
            }
          })
          const newLocal = (await transporter.sendMail({
            from: '"Nepays ID"',
            to: email,
            subject: 'Nepays ID - Forgot Password',
            html: `Click <a href="${process.env.URL}/reset-password?key=${key}">here</a> to reset your password.`
          }),
          function (error) {
            if (error) {
              return helper.response(response, 400, 'Failed to send email')
            }
          })
          return helper.response(response, 200, 'Email sent. Please check your inbox', newLocal)
        }
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  resetPassword: async (request, response) => {
    const { key, newPassword, confirmPassword } = request.body
    try {
      if (key === undefined || key === '') {
        return helper.response(response, 400, 'Please enter your key')
      } else if (newPassword === undefined || newPassword === '') {
        return helper.response(response, 400, 'Please enter a new password')
      } else if (confirmPassword === undefined || confirmPassword === '') {
        return helper.response(response, 400, 'Please confirm your new password')
      } else if (newPassword.length < 8 || newPassword.length > 16) {
        return helper.response(response, 400, 'Password must be 8-16 characters long')
      } else if (newPassword !== confirmPassword) {
        return helper.response(response, 400, "Password didn't match")
      } else {
        const checkKey = await getUserByKey(key)
        if (checkKey.length < 1) {
          return helper.response(response, 400, 'Invalid key')
        } else {
          const email = checkKey[0].email
          const difference = new Date() - checkKey[0].updated
          const minutesDifference = Math.floor(difference / 1000 / 60)
          if (minutesDifference > 5) {
            const setData = {
              reset_key: 0,
              updated: new Date()
            }
            await patchUserByEmail(setData, email)
            return helper.response(response, 400, 'Key has expired. Please enter your email again')
          } else {
            const salt = bcrypt.genSaltSync(9)
            const encryptPassword = bcrypt.hashSync(newPassword, salt)
            const setData = {
              password: encryptPassword,
              reset_key: 0,
              updated: new Date()
            }
            await patchUserByEmail(setData, email)
            return helper.response(response, 200, 'Password reset successfully')
          }
        }
      }
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
