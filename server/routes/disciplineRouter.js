const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const disciplineController = require('../Controllers/disciplineController');

router.post('/', disciplineController.create);

router.get('/', disciplineController.getAll);

router.delete('/:id', disciplineController.delete);

module.exports = router;