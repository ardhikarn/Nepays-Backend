const router = require('express').Router()
const { patch_edit_password } = require('../controller/password/password')

router.patch('/:id', patch_edit_password)

module.exports = router
