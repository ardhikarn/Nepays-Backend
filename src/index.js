const route = require("express").Router()

// Route
const profile = require("./routes/profile")
const pin = require("./routes/pin")
// Middle
route.use("/profile", profile)
route.use("/pin", pin)

module.exports = route
