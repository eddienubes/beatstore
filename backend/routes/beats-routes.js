const express = require('express');
const {Router} = require('express');
const {check} = require('express-validator');

const beatsControllers = require('../controllers/beats-controller');

const router = Router();


router.get('/:bid', beatsControllers.getBeatById);

router.get('/', beatsControllers.getAllBeats);

router.post(
    '/',
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