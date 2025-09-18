const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}  = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// Index Route
router.get("/", wrapAsync(listingController.index));

// new route 
router.get("/new",isLoggedIn,listingController.renderNewForm);

// show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing)
);

// Edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// update route
router.put("/:id", isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

// delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;