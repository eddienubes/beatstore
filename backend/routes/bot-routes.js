const {Router} = require('express');
const router = Router();

const botsController = require('../controllers/bots-controller');

router.post('/', botsController.register);
router.patch('/', botsController.updateBot);


module.exports = router;