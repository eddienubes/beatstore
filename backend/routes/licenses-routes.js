const {Router} = require('express');
const licensesController = require('../controllers/licenses-controller');
const router = Router();

router.get('/', licensesController.getAllLicenses);

router.patch('/', licensesController.updateLicense);

router.post('/', licensesController.creatLicense);

module.exports = router;