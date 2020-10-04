const router = require('express').Router()

const { getNotification, clickNotification } = require('../controller/notification')

router.get('/:id', getNotification)

router.patch('/:id', clickNotification)

module.exports = router
