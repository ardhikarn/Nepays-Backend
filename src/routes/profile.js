const router = require("express").Router()
const { get_profile_navbar } = require('../controller/profile/profile_navbar')

router.post("/navbar", get_profile_navbar);

module.exports = router