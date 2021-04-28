const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const fs = require('fs');
const path = require('path');
const Beat = require('../models/beat');
const User = require('../models/user');
const { promisify } = require('util');
const upload = require('../middleware/file-upload').single('previewAudio');
const mongoose = require('mongoose');
const { populateUserCart } = require('../shared/products');
const Comment = require('../models/comment');
const Like = require('../models/like');


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
        console.log(e.message);
        return next(new HttpError('Couldn\'t find a beat in database with such id..', 500));
    }

    if (!beat) {
        return next(
            new HttpError('Couldn\'t find a beat by specified id!', 404)
        );
    }

    let comments;
    try {
        comments = await Comment.aggregate([
            { $match: { beatId: new mongoose.Types.ObjectId(beatId) } },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'commentId',
                    // let: { commentId: '$_id' },
                    as: 'likes',
                    // pipeline: [
                    //     {
                    // $match: {
                    //     $expr: {$eq: ['$commentId', '$$commentId']}
                    // }

                    // }
                    // ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: {userId: '$userId'},
                    as: 'user',
                    pipeline: [
                        {$match: {$expr: {$eq: ["$$userId", "$_id"]}}},
                        {
                            $project: {
                                username: 1,
                                _id: 1,
                                email: 1
                            }
                        }
                    ]

                }
            }
        ]);
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Error while trying to find comments'));
    }

    res.json({
        message: 'Successfully found a beat', beat: {
            ...beat.toObject({ getters: true }),
            comments
        }
    });
};

const createBeat = async (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.files) {
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const { title, mp3Url, wavUrl, stemsUrl, bpm, scale, tags, moods, genres } = req.body;

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
    res.json({ message: 'Successfully added new beat!', beat: addedBeat.toObject({ getters: true }) });
};

const updateBeatById = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please, check your data', 403));
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
            updatedBeat: updatedBeat.toObject({ getters: true })
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

    let users;
    try {
        users = await User.find({ 'cart.items': { $elemMatch: { beatId: beatId } } });
        await Promise.all(users.map(async u => {
            await populateUserCart(u, next);
            const priceToSubtract = u.cart.items.find(i => i.beatId._id.toString() === beatId).licenseId.price;

            u.cart.total -= priceToSubtract;
            await u.save();
        }));
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('An error occurred while trying to populate users with such beat in the cart..'), 500);
    }

    try {
        await User.updateMany({
            'cart.items': { $elemMatch: { beatId: beatId } }
        }, {
            $pull: {
                'cart.items': { beatId }
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
    res.json({ message: 'Deleted a beat successfully' });
};

const getAllBeats = async (req, res, next) => {

    let beats;
    let { skip, limit, filter } = req.query;

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
                    title: { $regex: jsonFilter.search, $options: 'i' }
                },
                {
                    tags: { $regex: jsonFilter.search, $options: 'i' }
                },
                {
                    genres: { $regex: jsonFilter.search, $options: 'i' }
                },
                {
                    bpm: { $regex: jsonFilter.search, $options: 'i' }
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
            { skip }).sort({ loadTime: -1 }).limit(limit);

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
        beats: beats.map(b => b.toObject({ getters: true }))
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
    res.json({ message: 'Info is fetched successfully', info: filter });

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
            { $sample: { size: 1 } }
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

const downloadBeat = async (req, res, next) => {
    const beatId = req.params.bid;

    let beat;
    try {
        beat = await Beat.findById(beatId, {
            'mp3Url': false,
            'wavUrl': false,
            'stemsUrl': false,
        });
    } catch (e) {
        console.log(e);
        return next(new HttpError('Couldn\'t find a beat in database with such id..', 500));
    }

    if (!beat) {
        console.log(beat);
        return next(
            new HttpError('Couldn\'t find a beat by specified id!', 404)
        );
    }

    const path = path.join(__dirname, '/..', beat.previewAudioUrl).replace(new RegExp('\\\\', 'gi'), '/');

    res.download(path, beat.title + '.mp3', (err) => {
        if (err) {
            return next(new HttpError(err.message, 404));
        }
    });
}

const leaveComment = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid fields specified', 422));
    }

    const beatId = req.params.bid;
    const { text, userId } = req.body;

    let beat;
    try {
        beat = await Beat.findById(beatId, {
            'mp3Url': false,
            'wavUrl': false,
            'stemsUrl': false,
        });
    } catch (e) {
        console.log(e, 'beat');
        return next(new HttpError('Couldn\'t find a beat in database with such id..', 500));
    }

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        console.log(e, 'user');
        return next(new HttpError('Error while trying to find user', 500));
    }

    if (!beat || !user) {
        console.log(e, 'user', 'beat');
        return next(
            new HttpError('Couldn\'t find a beat or user by specified ids!', 404)
        );
    }

    const comment = new Comment({
        text,
        userId,
        beatId,
        date: new Date()
    });

    try {
        await comment.save();
    } catch (e) {
        console.log(e, 'comment');
        return next(new HttpError('Error while saving comment', 500));
    }
    res.status(200);
    res.json({ message: 'Successfully left a comment', comment: {
        ...comment.toObject({ getters: true }),
        user: [
            user
        ],
        likes: []
    } });
}

const leaveLike = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid arguments specified', 422));
    }

    const commentId = req.params.cid;
    const { userId } = req.body;

    let comment;
    let user;
    try {
        comment = await Comment.findById(commentId);
        user = await User.findById(userId);
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Error while trying to find data', 500));
    }

    if (!comment || !user) {
        return next(new HttpError('Invalid arguments specified, not found', 404));
    }

    const newLike = new Like({
        commentId,
        userId
    });

    comment.likesCount += 1;

    try {
        await newLike.save();
        await comment.save();
    } catch (e) {
        return next(new HttpError('Error while saving like', 500));
    }

    res.status(200);
    res.json({ message: 'Successfully left a like', like: newLike.toObject({ getters: true }) });
}

const removeLike = async (req, res, next) => {
    const commentId = req.params.cid;
    const userId = req.params.uid;

    let comment;
    let user;
    let like;
    try {
        comment = await Comment.findById(commentId);
        user = await User.findById(userId);
    } catch (e) {
        console.log(e.message);
        return next(new HttpError('Error while trying to find data', 500));
    }

    if (!comment || !user) {
        return next(new HttpError('Invalid arguments specified, not found', 404));
    }

    try {
        like = await Like.findOne({userId, commentId: comment._id});
    }
    catch (e) {
        return next(new HttpError('Error while trying to find a like', 500));
    }

    if (!like) {
        return next(new HttpError('Invalid arguments specified, not found (like)', 404));
    }

    comment.likesCount -= 1;

    try {
        await like.remove();
        await comment.save();
    } catch (e) {
        return next(new HttpError('Error while saving like', 500));
    }

    res.status(200);
    res.json({ message: 'Successfully removed a like'});
}

module.exports = {
    getBeatById,
    createBeat,
    updateBeatById,
    deleteBeat,
    getAllBeats,
    getUniqueInfo,
    getRandomBeat,
    downloadBeat,
    leaveComment,
    leaveLike,
    removeLike
};
