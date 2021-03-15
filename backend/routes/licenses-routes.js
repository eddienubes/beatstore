const {Router} = require('express');
const licensesController = require('../controllers/licenses-controller');
const router = Router();

router.get('/', licensesController.getAllLicenses);

router.patch('/', licensesController.updateLicense);

router.post('/', licensesController.creatLicense);

router.get('/:type', licensesController.getLicenseDescriptionByType)

module.exports = router;