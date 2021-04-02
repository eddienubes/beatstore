const fs = require('fs');

const streamToFile = (inputStream, filePath) => {
    return new Promise((resolve, reject) => {
        const fileWriteStream = fs.createWriteStream(filePath)
        inputStream
            .pipe(fileWriteStream)
            .on('finish', resolve)
            .on('error', reject)
    })
};

module.exports = {
    streamToFile
}
