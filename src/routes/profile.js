const router = require('express').Router()
const uploadImage = require('../middleware/multer')
const { get_profile, get_personal, patch_personal_name, patch_personal_phone, patch_profile_image } = require('../controller/profile/profile')

router.get('/personal/:id', get_personal)
router.patch('/profile_image/:id', uploadImage, patch_profile_image)
router.patch('/personal_name/:id', patch_personal_name)
router.patch('/personal_phone/:id', patch_personal_phone)

module.exports = router
