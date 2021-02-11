const HttpError = require('../models/http-error');
const {v4: uuid} = require('uuid');
const {validationResult} = require('express-validator');
const {getAudioDurationInSeconds} = require('get-audio-duration');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const Beat = require('../models/beat');


const getBeatById = async (req, res, next) => {
    const beatId = req.params.bid;

    let beat;

    try {
        beat = await Beat.findById(beatId);
    } catch (e) {
        return next(new HttpError('Couldn\'t find a beat in database with such id..'), 500);
    }

    if (!beat) {
        return next(
            new HttpError('Couldn\'t find a beat by specified id!', 404)
        );
    }

    res.json({message: 'Successfully found a beat', beat: beat.toObject({getters: true})});
};

const createBeat = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const {title, mp3Url, wavUrl, stemsUrl, bpm, scale, tags} = req.body;

    const filePath = path.join(req.files.previewAudio[0].path);

    const totalSeconds = await getAudioDurationInSeconds(filePath);

    const minutesInt = Math.floor(totalSeconds / 60);
    const secondsInt = Math.floor(totalSeconds % 60);

    const formattedMinutes = minutesInt < 10 ? '0' + String(minutesInt) : String(minutesInt);
    const formattedSeconds = secondsInt < 10 ? '0' + String(secondsInt) : String(secondsInt);

    const loadTime = new Date();

    const addedBeat = new Beat({
        title,
        imgUrl: path.normalize(req.files.cover[0].path),
        previewAudioUrl: path.normalize(req.files.previewAudio[0].path),
        mp3Url,
        wavUrl,
        stemsUrl,
        bpm: parseInt(bpm),
        scale,
        tags,
        loadTime,
        duration: formattedMinutes + ':' + formattedSeconds
    });

    try {
        await addedBeat.save();
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
        return next(
            new HttpError('Couldn\'t find a beat with this id..'),
            500
        );
    }

    try {
        await beat.remove()
    } catch (e) {
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
    let {skip, limit} = req.query;

    try {
        skip = skip && /^\d+$/.test(skip) ? Number(skip) : 0;
        limit = limit && /^\d+$/.test(limit) ? Number(limit) : 10;

        beats = await Beat.find(
            {},
            {
                'mp3Url': false,
                'wavUrl': false,
                'stemsUrl': false,
            },
            {skip, limit},);
    } catch (e) {
        console.log(e.message);
        return next(
            new HttpError(
                'Something went wrong while getting beats',
                500
            )
        );
    }

    res.status(200);
    res.json({message: 'Beats are fetched successfully', beats: beats.map(b => b.toObject({getters: true}))});
};

module.exports = {
    getBeatById,
    createBeat,
    updateBeatById,
    deleteBeat,
    getAllBeats
};
