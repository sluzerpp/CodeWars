const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const rankController = require('../Controllers/rankController');

router.post('/', rankController.create);
router.get('/', rankController.getAll);
router.delete('/:id', rankController.delete);

module.exports = router;