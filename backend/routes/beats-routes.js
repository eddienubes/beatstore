const express = require('express');
const {Router} = require('express');
const {check} = require('express-validator');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-standard-auth');
const checkBot = require('../middleware/check-bot-token');
const beatsControllers = require('../controllers/beats-controller');

const router = Router();

router.get('/info', beatsControllers.getUniqueInfo);

router.get('/random', beatsControllers.getRandomBeat);

router.get('/:bid', beatsControllers.getBeatById);

router.get('/', beatsControllers.getAllBeats);

// router.use(checkAuth);

router.post(
    '/',
    checkBot,
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
            .not()
            .isEmpty(),
        check('moods')
            .not()
            .isEmpty(),
        check('genres')
            .not()
            .isEmpty()
    ],
    beatsControllers.createBeat
);

router.patch(
    '/:bid',
    checkBot,
    fileUpload.fields([
            {
                name: 'previewAudio', maxCount: 1
            },
            {
                name: 'cover', maxCover: 1
            }
        ]),
    beatsControllers.updateBeatById);

router.delete(
    '/:bid',
    checkBot,
    beatsControllers.deleteBeat);


module.exports = router;