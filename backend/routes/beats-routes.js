const express = require('express');
const {Router} = require('express');
const {check} = require('express-validator');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const beatsControllers = require('../controllers/beats-controller');

const router = Router();

router.get('/info', beatsControllers.getUniqueInfo);

router.get('/random', beatsControllers.getRandomBeat);

router.get('/:bid', beatsControllers.getBeatById);

router.get('/', beatsControllers.getAllBeats);

router.use(checkAuth);

router.post(
    '/',
    fileUpload.fields([
        {
            name: 'previewAudio', maxCount: 1
        },
        {
            name: 'cover', maxCount: 1
        },
    ]),
        [
        check('title')
            .isLength({min: 1}),
            check('mp3Url')
                .not()
                .isEmpty(),
            check('wavUrl')
                .not()
                .isEmpty(),
            check('stemsUrl')
                .not()
                .isEmpty(),
            check('bpm')
                .not()
                .isEmpty(),
            check('scale')
                .not()
                .isEmpty(),
            check('tags')
                .isArray()
        ],
    beatsControllers.createBeat
);

router.patch(
    '/:bid',
    [
        check('audioUrl')
            .not()
            .isEmpty(),
        check('imgUrl')
            .not()
            .isEmpty(),
        check('title')
            .isLength({min: 1}),
        check('scale')
            .not()
            .isEmpty()
    ],
    beatsControllers.updateBeatById
);

router.delete('/:bid', beatsControllers.deleteBeat);


module.exports = router;