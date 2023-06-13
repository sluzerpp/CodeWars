const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const codeController = require('../Controllers/codeController');

router.post('/:id/code', codeController.createOrUpdate);

router.post('/:id/code/get', codeController.getOne);

router.get('/:id/code', codeController.getTaskLangs);

router.delete('/:id/code', codeController.delete);

module.exports = router;