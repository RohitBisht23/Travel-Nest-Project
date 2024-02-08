
function wrapAsync(fn) {
    return function(req,resp,next) {
        fn(req,resp,next).catch(next)
    };
};

module.exports = wrapAsync