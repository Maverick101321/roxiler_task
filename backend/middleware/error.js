const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    console.error(err);

    // MySQL duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // MySQL bad field error
    if (err.code === 'ER_BAD_FIELD_ERROR') {
        const message = 'Invalid field in request';
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

module.exports = errorHandler;