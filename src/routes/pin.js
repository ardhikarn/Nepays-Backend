const router = require('express').Router()
const { patch_new_pin, patch_edit_pin } = require('../controller/pin/pin')

router.patch('/:id', patch_new_pin)
router.patch('/pin_edit/:id', patch_edit_pin)

module.exports = router
