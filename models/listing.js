const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        set:(v) => v === "" ?"https://unsplash.com/photos/round-dining-table-set-with-various-dishes-and-drinks-uVOlW570gGw":v,
    },
    price:Number,
    location:String,
    country:String,
});

const Listing  = mongoose.model("listing",listingSchema);
modules.export = Listing;