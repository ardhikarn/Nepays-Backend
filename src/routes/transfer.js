const router = require('express').Router()

const { get_user, get_user_id } = require('../controller/transfer/transfer')

router.get('/', get_user)
router.get('/:id', get_user_id)

module.exports = router
