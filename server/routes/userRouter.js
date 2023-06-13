const Router = require('express');
const userController = require('../Controllers/userController');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const usertaskRouter = require('./userTask');

router.post('/registration', userController.registration);

router.post('/login', userController.login);

router.get('/auth', authMiddleware(), userController.check);

router.put('/', authMiddleware(), userController.update);

router.get('/', authMiddleware(), userController.getUserData);

router.delete('/', authMiddleware(), userController.delete);

router.use('/task', authMiddleware(), usertaskRouter)

module.exports = router;