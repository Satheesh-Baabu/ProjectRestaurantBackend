const express = require('express')
const { signin, login, dashboard ,getUsers,addUser,getCount,getorders} = require('../controllers/dashboardController')
const verifyToken = require('../middleware/verifyToken')

const router = express.Router()

router.post('/login', login)
router.post('/signin', signin)
router.get('/dashboard',verifyToken,dashboard)
router.post('/add-users',addUser)
router.get('/users',getUsers)
router.get('/get-count',getCount)
router.get('/admin-orders',getorders)

module.exports = router;