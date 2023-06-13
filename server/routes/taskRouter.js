const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../Controllers/taskController');
const codeRouter = require('./codeRouter');
const solutionRouter = require('./solutionRouter');

router.post('/', taskController.createOrUpdate);

router.get('/', taskController.getAll);
router.get('/:id', taskController.getOne);
router.delete('/:id', taskController.delete);
router.put('/:id', taskController.updateState);
router.use('/', codeRouter);
router.use('/', solutionRouter);

module.exports = router;