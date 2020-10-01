const router = require("express").Router()
const uploadImage = require('../middleware/multer')
const { get_profile, get_personal, patch_personal_name, patch_personal_phone, patch_profile_image } = require('../controller/profile/profile')

router.post("/profile", get_profile);
router.post("/personal", get_personal);
router.patch("/profile_image", uploadImage, patch_profile_image);
router.patch("/personal_name", patch_personal_name);
router.patch("/personal_phone", patch_personal_phone);

module.exports = router