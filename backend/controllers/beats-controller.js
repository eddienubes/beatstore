const HttpError = require('../models/http-error');
const {v4: uuid} = require('uuid');
const {validationResult} = require('express-validator');

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

const getBeatById = (req, res, next) => {
    const beatId = req.params.bid;
    const beat = DUMMY_BEATS.find(b => b.id === beatId);

    if (!beat) {
        return next(
            new HttpError('Couldn\'nt find a beat for specified id!', 404)
        );
    }

    res.json(beat);
};

const createBeat = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data', 422);
    }

    const {audioUrl, imgUrl, bpm, title, scale, tags} = req.body;
    const addedBeat = {
        id: uuid(),
        audioUrl,
        imgUrl,
        bpm,
        title,
        scale,
        tags
    };

    DUMMY_BEATS.push(addedBeat);

    res.status(201);
    res.json(addedBeat);
};

const updateBeatById = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please, check your data');
    }

    const {audioUrl, imgUrl, bpm, title, scale, tags} = req.body;
    const beatId = req.params.bid;

    const updatedBeat = {...DUMMY_BEATS.find(b => b.id === beatId)};
    const beatIndex = DUMMY_BEATS.findIndex(b => b.id === beatId);

    updatedBeat.audioUrl = audioUrl;
    updatedBeat.imgUrl = imgUrl;
    updatedBeat.bpm = bpm;
    updatedBeat.title = title;
    updatedBeat.scale = scale;
    updatedBeat.tags = tags;

    DUMMY_BEATS[beatIndex] = updatedBeat;

    res.status(200);
    res.json(updatedBeat);
};

const deleteBeat = (req, res, next) => {
    const beatId = req.params.bid;

    if (!DUMMY_BEATS.find(b => b.id === beatId)) {
        throw new HttpError('Couldn\'t find a beat with this id..');
    }

    DUMMY_BEATS = DUMMY_BEATS.filter(b => b.id !== beatId);

    res.status(200);
    res.json({message: 'Deleted beat'});
};

module.exports = {
    getBeatById,
    createBeat,
    updateBeatById,
    deleteBeat
};
