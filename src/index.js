const route = require("express").Router()

// Route
const profile = require("./routes/profile")
const pin = require("./routes/pin")
const password = require("./routes/password")
// Middle
route.use("/profile", profile)
route.use("/pin", pin)
route.use("/password_change", password)

module.exports = route
