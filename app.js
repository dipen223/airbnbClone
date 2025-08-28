const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing  = require("./models/listing.js")


const MONGO_URL = "mongodb://127.0.0.1:27017/myairbnb";

main().then(() =>{
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res) =>{
    res.send("Ready to serve");
});

app.get("/testListing",async(req,res) =>{
    let sampleListing = new Listing({
        title:"Dallas Home",
        description:"Avaialbe for 2 days.It is closeby downtown.",
        price:350,
        location:"Dallas,TX",
        country:"United States",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("succesfull testing");
});

app.listen(8080,() =>{
    console.log("server is listening to port 8080");
})