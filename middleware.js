const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema , reviewSchema } = require('./schema.js');

const isLoggedIn = (req,resp,next) =>{
    // console.log(req.path, '...',req.originalUrl)
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; 
        req.flash('error','You must be logged in!');
        return resp.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn;

//New middleware to redirect the user back to newlisting
module.exports.saveRedirectUrl = (req,resp,next) =>{
    if(req.session.redirectUrl) {
        resp.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}


//For the listing owner
module.exports.isOwner = async(req,resp,next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(resp.locals.currUser._id)) {
        req.flash('error', "You are not the owner of this listing");
        return resp.redirect(`/listing/${id}`);
    }
    next();
};

//function to convert the validation schema(joi) into middleware
module.exports.validateListing = (req,resp,next) =>{
    const { error } = listingSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
}


//function to convert the validation schema(joi) into middleware
module.exports.validateReview = (req,resp,next) =>{
    const { error } = reviewSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
}

//For the review owner
module.exports.isReviewAuthor = async(req,resp,next) =>{
    let { id , reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author._id.equals(resp.locals.currUser._id)) {
        req.flash('error', "You are not the owner of this review");
        return resp.redirect(`/listing/${id}`);
    }
    next();
};
