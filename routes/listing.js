const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");






// All Listings Route
router.get("/", wrapAsync(listingController.index));
  
  // New Route
  router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));
  
  // Show Route
  router.get("/:id", wrapAsync(listingController.showListing));
  
  // Create route
  router.post("/", 
    validateListing, 
    isLoggedIn, 
    wrapAsync(listingController.createListing));
  
  // Edit Route
  router.get("/:id/edit", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.renderEditForm));
  
  // Update Route
  router.put("/:id", 
    isLoggedIn, 
    isOwner,
    validateListing, 
    wrapAsync(listingController.updateListing));
  
  router.delete("/:id", 
    isLoggedIn,
    isOwner,  
    wrapAsync(listingController.deleteListing));
  

  module.exports = router;