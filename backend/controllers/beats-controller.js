const HttpError = require('../models/http-error');
const {v4: uuid} = require('uuid');
const {validationResult} = require('express-validator');

const Beat = require('../models/beat');

let DUMMY_BEATS = [
    {
        "id": "1",
        "audioUrl": "/tracks/Vacation Cm 135bpm.mp3",
        "imgUrl": "/covers/W6MT8iR.png",
        "bpm": 135,
        "time": "03:35",
        "title": "Vacation",
        "scale": "Cm",
        "tags": ["JackHill", "JoshA", "Guitar", "Chill", "Soul", "biba", "boba", "eiqweqwe", "qweqweqwe", "qweqwe", "qweqweqwe", "qweqweqweqwe", "qweqwe"]
    },
    {
        "id": "2",
        "audioUrl": "/tracks/Raindrop Gm 139.mp3",
        "imgUrl": "/covers/W6MT8iR.png",
        "bpm": 139,
        "time": "04:05",
        "title": "Raindrop",
        "scale": "Gm",
        "tags": ["Logic", "Eminem", "Quadeca", "Hard", "BrokenDrill"]
    },
    {
        "id": "3",
        "audioUrl": "/tracks/Sharp G_sharp_m_190bpm.mp3",
        "imgUrl": "/covers/W6MT8iR.png",
        "bpm": 190,
        "time": "02:27",
        "title": "Sharp",
        "scale": "G#m",
        "tags": ["Tyga", "Tory Lanez", "Club", "Hard"]
    }
];

const getBeatById = async (req, res, next) => {
    const beatId = req.params.bid;

    let beat;

    try {
        beat = await Beat.findById(beatId);
    }
    catch (e) {
        return next(new HttpError('Couldn\'t find a beat in database with such id..'), 500);
    }

    if (!beat) {
        return next(
            new HttpError('Couldn\'nt find a beat by specified id!', 404)
        );
    }

    res.json({message: 'Successfully found a beat', beat: beat.toObject({getters: true})});
};

const createBeat = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const {title, audioUrl, imgUrl, bpm, scale, tags} = req.body;

    const loadTime = new Date();
    const duration = "3:00" // DUMMY logic // TODO

    const addedBeat = new Beat({
        title,
        audioUrl,
        imgUrl,
        bpm,
        duration,
        scale,
        loadTime,
        tags
    });

    try {
        await addedBeat.save();
    }
    catch (e) {
        const err = new HttpError('Creating new beat has been failed', 500);
        return next(err);
    }

    res.status(201);
    res.json({message: 'Successfully added new beat!', beat: addedBeat.toObject({getters: true})});
};

const updateBeatById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please, check your data'));
    }

    const {title, audioUrl, imgUrl, bpm, scale, tags} = req.body;
    const beatId = req.params.bid;

    const duration = "3:00"; // Again DUMMY duration logic // TODO

    let updatedBeat;
    try {
        updatedBeat = await Beat.findById(beatId);
    }
    catch (e) {
        return next(
            new HttpError('Something went wrong while trying to find a beat..'),
            500
        );
    }

    updatedBeat.title = title;
    updatedBeat.audioUrl = audioUrl;
    updatedBeat.imgUrl = imgUrl;
    updatedBeat.bpm = bpm;
    updatedBeat.scale = scale;
    updatedBeat.tags = tags;

    try {
        await updatedBeat.save();
    }
    catch (e) {
        return next(
            new HttpError('Something went wrong while saving updated beat to database..'),
            500
        );
    }

    res.status(200);
    res.json({message: 'Successfully updated a beat..', updatedBeat: updatedBeat.toObject({getters: true})});
};

const deleteBeat = async (req, res, next) => {
    const beatId = req.params.bid;

    let beat;
    try {
        beat = await Beat.findById(beatId);
    }
    catch (e) {
        return next(
            new HttpError('Couldn\'t find a beat with this id..'),
            500
        );
    }
    
    try {
        await beat.remove()
    }
    catch (e) {
        return next(
            new HttpError('Couldn\'t delete a beat from database..'),
            500
        );
    }

    res.status(200);
    res.json({message: 'Deleted a beat successfully'});
};

const getAllBeats = async (req, res, next) => {
    let beats;

    try {
        beats = await Beat.find({});
    }
    catch (e) {
        return next(
            new HttpError(
                'Something went wrong while getting beats',
                500
            )
        );
    }

    res.status(200);
    res.json({message: 'Beats are fetched successfully', beats});
};

module.exports = {
    getBeatById,
    createBeat,
    updateBeatById,
    deleteBeat,
    getAllBeats
};
