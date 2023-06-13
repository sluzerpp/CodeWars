const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const usertaskController = require('../Controllers/usertaskController');

router.post('/', usertaskController.create);
router.get('/', usertaskController.getUserTasks);
router.get('/:id', usertaskController.getOneUserTask);
router.put('/:id', usertaskController.updateState);


module.exports = router;