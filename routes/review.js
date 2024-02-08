const express = require('express')
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const  isLoggedIn = require('../middleware.js');
const { validateReview, isReviewAuthor } = require('../middleware.js');

//Constroller
const reviewController = require('../controllers/reviews.js');


//Reviews
//Post review route 
router.post('',isLoggedIn,validateReview, wrapAsync(reviewController.postReview));

//Review Delete route
router.delete('/:reviewId',isLoggedIn, isReviewAuthor ,wrapAsync(reviewController.destroyReview));

module.exports = router;