const Router = require('express')
const userRouter = require('./userRouter')
const messageRouter = require('./messageRoter')

const router = new Router()

router.use('/user', userRouter)
router.use('/chats', messageRouter)

module.exports = router