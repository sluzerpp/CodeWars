const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const solutionController = require('../Controllers/solutionController');

router.post('/:id/solution/get', solutionController.getAll);

router.post('/:id/solution', solutionController.getUserSolution);

module.exports = router;