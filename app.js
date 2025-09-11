const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/myairbnb";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Ready to serve");
});




// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// new route 
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// Create Route
app.post("/listings", wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new expressError(400,result.error);
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
);

// Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new expressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//I am getting an errro whenever i am trying to use this.
// app.all("*",(req,res,next) =>{
//     next(new expressError(404,"Page Not Found"));
// })

app.use((req, res, next) => {
    res.status(404).send("Page Not Found");
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
