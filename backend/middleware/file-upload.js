const multer = require('multer');
const {v4: uuid} = require('uuid');

const FILE_MIME_TYPE_MAP = {
    'audio/mpeg': 'mp3',
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const fileUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.fieldname === 'previewAudio') {
                cb(null, 'data/beats')
            }
            else if (file.fieldname === 'cover') {
                cb(null, 'data/covers')
            }
        },
        filename: (req, file, cb) => {
            const ext = FILE_MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!FILE_MIME_TYPE_MAP[file.mimetype];
        console.log(file, 'file upload');
        const error = isValid ? null : new Error('Invalid file type!');
        cb(error, isValid);
    }
});

module.exports = fileUpload;
