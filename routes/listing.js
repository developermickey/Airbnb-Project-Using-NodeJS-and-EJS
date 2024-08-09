const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");


router
.route("/")
.get(wrapAsync(listingController.index))
.post( 
  validateListing, 
  isLoggedIn, 
  wrapAsync(listingController.createListing)
);

  // New Route
  router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn, 
  isOwner,
  validateListing, 
  wrapAsync(listingController.updateListing))
  .delete( 
    isLoggedIn,
    isOwner,  
    wrapAsync(listingController.deleteListing));

  
  // Edit Route
  router.get("/:id/edit", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.renderEditForm));

  

  module.exports = router;