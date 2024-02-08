const express = require('express');
const router = express.Router(); //Creating router object here
const wrapAsync = require('../utils/wrapAsync.js'); //Import for error handling
const Listing = require('../models/listing.js');
const  isLoogedIn  = require('../middleware');
const { isOwner,validateListing }  = require('../middleware');

//Cloudinary
const { storage } = require('../cloudConfig.js');


//Multer for upload image
const multer = require('multer');
// const upload = multer({dest : 'uoloads/ '});
const upload = multer({ storage });
//Controller
const listingController = require('../controllers/listing.js');



//Router.route ->restructuring the same path routes
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(
        isLoogedIn,
        
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing));
    

   
//Create ->New Route
router.get("/new",isLoogedIn,listingController.renderNewForm)


router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoogedIn,isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(isLoogedIn,
        isOwner, 
        wrapAsync(listingController.DestroyListing))



//Index Route
// router.get('/',wrapAsync(listingController.index));




//Show Route
// router.get("/:id",wrapAsync(listingController.showListing))


//create ->create Route
// router.post('/',isLoogedIn,validateListing,wrapAsync(listingController.createListing));


//Update->Edit
router.get("/:id/edit",isLoogedIn,isOwner,wrapAsync(listingController.renderEditForm));


//Update Route->save
// router.put('/:id',isLoogedIn,isOwner,validateListing ,wrapAsync(listingController.updateListing))


//Delete Route
// router.delete('/:id',isLoogedIn,isOwner, wrapAsync(listingController.DestroyListing))

module.exports = router;