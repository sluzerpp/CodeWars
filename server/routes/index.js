const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const taskRouter = require('./taskRouter');
const userRouter = require('./userRouter');
const runRouter = require('./runRouter');
const rankRouter = require('./rankRouter');
const disciplineRouter = require('./disciplineRouter');
const langController = require('../Controllers/langController');

router.use('/user', userRouter);
router.get('/languages', authMiddleware(), langController.getAll);
router.use('/run', authMiddleware(), runRouter);
router.use('/discipline', authMiddleware(['ADMIN']), disciplineRouter);
router.use('/task', authMiddleware(), taskRouter);
router.use('/rank', authMiddleware(['ADMIN']), rankRouter);

module.exports = router;