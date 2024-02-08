if(process.env.NODE_ENV != 'production') {
    require('dotenv').config();

}



const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);


const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user');


app.use(methodOverride('_method'));
//Setup ejs
const path = require('path');

//Importing the model (Schema)file
// const Listing = require('./models/listing.js');
const ExpressError = require('./utils/ExpressError.js');
// const { error } = require('console');

//Session
const session = require('express-session');
const mongoStore = require('connect-mongo');
//flash
const flash = require('connect-flash');

//Passport 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const MongoStore = require('connect-mongo');



const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl);
}

main().then(() =>{
    console.log('Connection made successfully');
}).catch((err) =>{
    console.log(err);
});

//Set up ejs rest path
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended : true}))//So the out request data can be parse
app.use(express.static(path.join(__dirname,'public')));

const store = MongoStore.create({
    mongoUrl : dbUrl,

    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24 * 3600, //In the form of seconds
})

store.on('error', () =>{
    console.log('ERROR in MONGO SESSION STORE',err);
});

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized  : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000
    },
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,resp,next) =>{
    resp.locals.success = req.flash('success');
    resp.locals.error = req.flash('error');
    resp.locals.currUser = req.user;
    next();
});



app.use('/listing', listingRouter);
app.use('/listing/:id/reviews',reviewRouter)
app.use('/', userRouter);


app.all('*',(req,resp,next) =>{
    next(new ExpressError(404,'Page Not Found!'))
});

//Middleware that will handle the error
app.use((err,req,resp, next) =>{
    let { statusCode = 404, message = 'You got the error!'} = err;
    resp.status(statusCode).render('error.ejs',{message})

});




app.listen('8080',() =>{
    console.log(`Server is listening at port 8080`)
})