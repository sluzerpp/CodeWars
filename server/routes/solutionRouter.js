const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const solutionController = require('../Controllers/solutionController');

router.get('/:id/solution', solutionController.getAll);

router.post('/:id/solution', solutionController.getUserSolution);

module.exports = router;