const Router = require('express')
const UserController = require('../controllers/UserController')
const router = new Router()

router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)

router.get('/profile/:id', UserController.getProfile)
router.get('/profiles', UserController.getAllUsers)

router.put('/addInfo', UserController.addInfo)
router.put('/changeConfidence', UserController.changeConfidence)
router.put('/addLike/:id', UserController.addLike)
router.put('/removeLike/:id', UserController.removeLike)

router.delete('/delete/:id', UserController.delete)


module.exports = router