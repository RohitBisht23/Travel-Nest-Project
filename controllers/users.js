const User = require('../models/user');

//Getting sign up form
module.exports.renderSignUpForm = (req,resp) => {
    resp.render('users/signUp.ejs');
}

//Post
module.exports.signUp = async(req,resp) =>{
    try{
        let { username, email, password } = req.body;

        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) =>{
            if(err) {
                return next(err);
            } 
            req.flash('success', 'Welcome to Wanderlust!');
            resp.redirect('/listing');
            
        })
 
    } catch(e) {
        req.flash('error', e.message);
    }
}


//Getting login form
module.exports.renderLoginForm = (req,resp) => {
    resp.render('users/login.ejs');
}


//Log in seccess
module.exports.logIn = async(req,resp,next) =>{
    req.flash('success', 'Welcome back to Wanderlust! You are logged in!');
    
    let RedirectUrl = resp.locals.redirectUrl || '/listing'
    resp.redirect(RedirectUrl);
}

//log out success
module.exports.logOut =  (req,resp,next) =>{
    req.logout((err) =>{
        if(err) {
            return next(err);
        } 
        req.flash('success', 'You are now logged out');
        resp.redirect('/listing');
    }
)}
