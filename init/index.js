//Logic of initialization
const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing.js');

//Connecting Database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL)
}

main().then(() =>{
    console.log('Connection made successfully');
}).catch((err) =>{
    console.log(err);
});

//function to add data before we delete the random data that is present
const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner : '65b3e6c2845bde9afbd2d363'
    }))
    await Listing.insertMany(initData.data);
    console.log('Data was initialized');
}

initDB();