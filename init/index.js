const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connection successfully to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}


const initdb = async () => {
    await Listing.deleteMany({});
    
    let data = initdata.data.map((item) => ({
        ...item,
        image: item.image.url
    }));

    data = data.map((obj) => ({
        ...obj,
        owner: "67ae33a4a5d56ec6c95757d8"
    }));

    await Listing.insertMany(data);
    console.log("Database initialized");
};

initdb();