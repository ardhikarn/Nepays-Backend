const router = require("express").Router()
const { get_profile, get_personal } = require('../controller/profile/profile')

router.post("/profile", get_profile);
router.post("/personal", get_personal);

module.exports = router