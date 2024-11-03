// Intentional error generation
exports.generateError = (req, res, next) => {
    const error = new Error('Intentional 500 error');
    error.status = 500;
    next(error);
};