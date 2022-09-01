const Router = require('express')
const router = new Router()
const MessageController = require('../controllers/MessageController')

router.post('/addmsg', MessageController.addMessage)
router.post('/getmsg', MessageController.getMessage)

module.exports = router