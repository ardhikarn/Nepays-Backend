const route = require("express").Router()

// Route
const profile = require("./routes/profile")
// Middle
route.use("/profile", profile)

module.exports = route
