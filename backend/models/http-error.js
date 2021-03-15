
class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // add message property
        this.code = errorCode || 500;
    };
}

module.exports = HttpError;