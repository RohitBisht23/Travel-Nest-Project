const Listing = require('../models/listing');
const Review = require('../models/review');

//Post
module.exports.postReview = async(req,resp)=>{
    // console.log(req.params.id)
    const listing = await Listing.findById(req.params.id);

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log('New Listing review is saved')
    // resp.send('New review is saved');

    req.flash('success', 'New review is added');
    resp.redirect(`/listing/${listing._id}`)
}


//Delete
module.exports.destroyReview = async(req,resp,next)=>{
    let {id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted');
    resp.redirect(`/listing/${id}`);
}