const HttpError = require('../models/http-error');
const {v4: uuid} = require('uuid');
const {validationResult} = require('express-validator');
const {getAudioDurationInSeconds} = require('get-audio-duration');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const Beat = require('../models/beat');
const User = require('../models/user');
const {promisify} = require('util');
const upload = require('../middleware/file-upload').single('previewAudio');
const mongoose = require('mongoose');

const getBeatDuration = (totalSeconds) => {
    const minutesInt = Math.floor(totalSeconds / 60);
    const secondsInt = Math.floor(totalSeconds % 60);

    const formattedMinutes = minutesInt < 10 ? '0' + String(minutesInt) : String(minutesInt);
    const formattedSeconds = secondsInt < 10 ? '0' + String(secondsInt) : String(secondsInt);

    return formattedMinutes + ':' + formattedSeconds;
}

const getBeatById = async (req, res, next) => {
    const beatId = req.params.bid;

    let beat;

    try {
        beat = await Beat.findById(beatId, {
            'mp3Url': false,
            'wavUrl': false,
            'stemsUrl': false,
        });
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
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.files) {
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    // TODO IF THE USER WHO CREATES/PATCHES/DELETES BEAT IS AN ADMIN
    // IF EVERY ROUTE RELATED TO MANAGING DATA
    // userData with userId is included by middleware for verifying

    const {title, mp3Url, wavUrl, stemsUrl, bpm, scale, tags, moods, genres} = req.body;

    const filePath = path.join(req.files.previewAudio[0].path);

    const totalSeconds = await getAudioDurationInSeconds(filePath);


    const loadTime = new Date();

    const addedBeat = new Beat({
        title,
        imgUrl: path.normalize(req.files.cover[0].path),
        previewAudioUrl: path.normalize(req.files.previewAudio[0].path),
        mp3Url,
        wavUrl,
        stemsUrl,
        bpm: bpm,
        scale,
        loadTime,
        tags: tags.replace(/\s/g, '').split(','),
        moods: moods.replace(/\s/g, '').split(','),
        genres: genres.replace(/\s/g, '').split(','),
        duration: getBeatDuration(totalSeconds)
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
    let fields = {};

    for (const prop in req.body) {
        if (Object.prototype.hasOwnProperty.call(req.body, prop)) {
            fields[prop] = req.body[prop];
        }
    }

    const beatId = req.params.bid;

    let updatedBeat;
    try {
        updatedBeat = await Beat.findById(beatId);
    } catch (e) {
        return next(
            new HttpError('Something went wrong while trying to find a beat..'),
            500
        );
    }

    if (!updatedBeat) {
        return next(
            new HttpError('Such beat hasn\'t been found!'),
            403
        );
    }

    for (const prop in fields) {
        updatedBeat[prop] = fields[prop];
    }

    if (req?.files?.previewAudio) {
        const unlink = promisify(fs.unlink);

        try {
            await unlink(path.join(updatedBeat.previewAudioUrl))
        } catch (e) {
            console.log(e.message + ' from audio deletion on backend');
        }

        const filePath = path.join(req.files.previewAudio[0].path);
        let totalSeconds;
        try {
            totalSeconds = await getAudioDurationInSeconds(filePath);
        } catch (e) {
            return next(new HttpError('Error while calculating duration..'), 500);
        }
        updatedBeat.duration = getBeatDuration(totalSeconds);
        updatedBeat.previewAudioUrl = path.normalize(req.files.previewAudio[0].path);
    }

    if (req?.files?.cover) {
        const unlink = promisify(fs.unlink);

        try {
            await unlink(path.join(updatedBeat.imgUrl))
        } catch (e) {
            console.log(e.message);
            // return next(new HttpError('Something went wrong while deleting existing img..', 500));
        }
        updatedBeat.imgUrl = path.normalize(req.files.cover[0].path);
    }

    try {
        await updatedBeat.save();
    } catch (e) {
        return next(
            new HttpError('Something went wrong while saving updated beat to database..'),
            500
        );
    }

    res.status(200);
    res.json(
        {
            message: 'Successfully updated a beat..',
            updatedBeat: updatedBeat.toObject({getters: true})
        }
    );
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
        await User.updateMany({
            'cart.items': {$elemMatch: {beatId: beatId}}
        }, {
            $pull: {
                'cart.items': {beatId}
            }
        });

    } catch (e) {
        return next(new HttpError('An error occurred while trying to find users with such beat in the cart..'), 500);
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
    let {skip, limit, filter} = req.query;

    let jsonFilter;
    let mongooseFilter = {};

    if (filter) {
        jsonFilter = JSON.parse(filter);

        if (jsonFilter.bpm) {
            mongooseFilter.bpm = jsonFilter.bpm;
        }

        if (jsonFilter.genres) {
            mongooseFilter.genres = jsonFilter.genres;
        }

        if (jsonFilter.moods) {
            mongooseFilter.moods = jsonFilter.moods;
        }

        if (jsonFilter.tags) {
            mongooseFilter.tags = jsonFilter.tags;
        }

        if (jsonFilter.search !== '') {
            jsonFilter.search = jsonFilter.search.replace(/#+/, '');
            mongooseFilter.$or = [
                {
                    title: {$regex: jsonFilter.search, $options: 'i'}
                },
                {
                    tags: {$regex: jsonFilter.search, $options: 'i'}
                },
                {
                    genres: {$regex: jsonFilter.search, $options: 'i'}
                },
                {
                    bpm: {$regex: jsonFilter.search, $options: 'i'}
                }
            ]

        }
    }

    try {
        skip = skip && /^\d+$/.test(skip) ? Number(skip) : 0;
        limit = limit && /^\d+$/.test(limit) ? Number(limit) : 10;

        beats = await Beat.find(
            mongooseFilter,
            {
                'mp3Url': false,
                'wavUrl': false,
                'stemsUrl': false,
            },
            {skip}).sort({loadTime: -1}).limit(limit);

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
    res.json({
        message: 'Beats are fetched successfully',
        beats: beats.map(b => b.toObject({getters: true}))
    });
};

const getUniqueInfo = async (req, res, next) => {

    let beats;
    const filter = {};
    try {
        beats = await Beat.find(
            {},
            {
                'title': false,
                'imgUrl': false,
                'previewAudioUrl': false,
                'duration': false,
                'scale': false,
                'loadTime': false,
                'mp3Url': false,
                'wavUrl': false,
                'stemsUrl': false,
                '_id': false
            });
    } catch (e) {
        console.log(e.message);
        return next(
            new HttpError(
                'Something went wrong while getting info about beats',
                500
            )
        );
    }
    let bpms = [];
    let moods = [];
    let genres = [];
    let tags = [];

    const sortCb = (a, b) => {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }

        return 0;
    }

    beats.map(b => bpms.push(b.bpm));
    beats.map(b => moods.push(...b.moods));
    beats.map(b => genres.push(...b.genres));
    beats.map(b => tags.push(...b.tags));

    filter.bpms = bpms.filter((value, index, self) => self.indexOf(value) === index).sort(sortCb);
    filter.moods = moods.filter((value, index, self) => self.indexOf(value) === index).sort(sortCb);
    filter.genres = genres.filter((value, index, self) => self.indexOf(value) === index).sort(sortCb);
    filter.tags = tags.filter((value, index, self) => self.indexOf(value) === index).sort(sortCb);

    res.status(200);
    res.json({message: 'Info is fetched successfully', info: filter});

}

const getRandomBeat = async (req, res, next) => {

    let beats;

    try {
        beats = await Beat.aggregate([
            {
                $project: {
                    'mp3Url': false,
                    'wavUrl': false,
                    'stemsUrl': false,
                }
            },
            {$sample: {size: 1}}
        ]);
    } catch (e) {
        console.log(e.message);
        return next(
            new HttpError(
                'Something went wrong while getting random beat',
                500
            )
        );
    }

    res.status(200);
    res.json({
        message: 'Successfully retrieved random beat', beat: beats.map(b => {
            return {
                ...b,
                id: b._id.toString()
            }
        })[0]
    })
}

module.exports = {
    getBeatById,
    createBeat,
    updateBeatById,
    deleteBeat,
    getAllBeats,
    getUniqueInfo,
    getRandomBeat
};
