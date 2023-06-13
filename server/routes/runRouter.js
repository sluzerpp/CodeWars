const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const runController = require('../Controllers/runController');

router.post('/js', runController.runJS);

router.post('/ts', runController.runTS);

router.post('/cs', runController.runCS);

router.post('/java', runController.runJAVA);

module.exports = router;