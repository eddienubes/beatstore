
class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // add message property
        this.code = errorCode;
    };
}

module.exports = HttpError;