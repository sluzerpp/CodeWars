const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const disciplineController = require('../Controllers/disciplineController');

router.post('/', authMiddleware(['ADMIN']), disciplineController.create);

router.get('/', disciplineController.getAll);

router.delete('/:id', authMiddleware(['ADMIN']), disciplineController.delete);

module.exports = router;