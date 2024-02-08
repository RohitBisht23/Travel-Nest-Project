const Listing = require('../models/listing.js')
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({accessToken : mapToken});

//Index 
module.exports.index = async(req,resp) =>{
    const allListings = await Listing.find({})
    resp.render("listings/index.ejs",{ allListings })
}

//New 
module.exports.renderNewForm = (req,resp) =>{

    resp.render('listings/new.ejs');
}


//Show
module.exports.showListing = (async (req,resp) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : 'reviews', populate :{
        path : 'author',
    } })
    .populate('owner');
    if(!listing) {
        req.flash('error', 'Listing you requested for does not exist!');
        resp.redirect('/listing');
    }
    console.log(listing)
    resp.render("listings/show.ejs",{listing});
    // console.log(listing)
})


//Create
module.exports.createListing = async(req,resp,next) =>{
    let response = await geocodingClient.forwardGeocode ({
        query : req.body.listing.location ,
        limit : 1
    })
    .send();

    // console.log(response.body.features[0].geometry);
    // resp.send('Done')

    // let listing = req.body.listing;
    // console.log(listing);

    let url = req.file.path;
    let filename = req.file.filename;

    // console.log(url,'....', filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    
    let savedListing = await newListing.save();
    console.log(savedListing)
    req.flash('success' , 'New Listing is added'); //Flash sms

    resp.redirect('/listing'); 
}

//Edit
module.exports.renderEditForm = async(req,resp) =>{
    let { id } = req.params;

    
    let listing = await Listing.findById(id)

    if(!listing) {
        req.flash('error', 'Listing you requested for does not exist!');
        resp.redirect('/listing');
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_23,w_250");


    resp.render("listings/edit.ejs",{listing, originalImageUrl})
}

//Update save
module.exports.updateListing = async (req,resp) =>{
    // if(req.body.listen) {
    //     next(new ExpressError(400,'Send valid data for listing'))
    // }
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};

        await listing.save();
    }

    req.flash('success', 'Listing is successfully')

    resp.redirect(`/listing/${id}`);
}


//Delete
module.exports.DestroyListing = async(req,resp) =>{
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);

    req.flash('success', 'Listing is successfully deleted');
    resp.redirect('/listing');
}