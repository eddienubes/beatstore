const {Router} = require('express');
const licensesController = require('../controllers/licenses-controller');
const router = Router();
const checkBot = require('../middleware/check-bot-token');

router.get('/', licensesController.getAllLicenses);

router.get('/info/:lid', licensesController.getLicenseById);

router.patch('/:lid', checkBot, licensesController.updateLicense);

router.post('/', checkBot, licensesController.creatLicense);

router.get('/:type', licensesController.getLicenseDescriptionByType)

module.exports = router;