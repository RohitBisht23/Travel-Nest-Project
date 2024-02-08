const express = require('express');
const router  = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');


//Controller
const userController = require('../controllers/users.js');


//Router.route ->For restructuring the combining the same paths
router.route('/signup')
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp))


router.route('/login')
    .get(userController.renderLoginForm )
    .post(saveRedirectUrl,
    passport.authenticate('local',{failureRedirect : '/login',failureFlash : true}),
    wrapAsync(userController.logIn));


//Get route
// router.get('/signup', userController.renderSignUpForm);


//Post route
// router.post('/signup', wrapAsync(userController.signUp));


//login
// router.get('/login',userController.renderLoginForm );

//POST
// router.post('/login',saveRedirectUrl,
//     passport.authenticate('local',{failureRedirect : '/login',failureFlash : true}),
//     wrapAsync(userController.logIn));


//Log out router
router.get('/logout',userController.logOut);


module.exports = router;