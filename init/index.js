const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() =>{
    console.log("connection successfully to DB");
}).catch(err => console.log(err));

async function main () {
    await mongoose.connect(MONGO_URL);
}



const initdb = async () =>{
    await Listing.deleteMany({});
     const data=initdata.data.map((item)=>{
        return {...item,image:item.image.url};
    });
    await Listing.insertMany(data);
    console.log("database inisilized");
};

initdb();