const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner, validateListing } = require("../middleware");



// All Listings Route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }));
  
  // New Route
  router.get("/new", isLoggedIn, wrapAsync(async (req, res) => {
    res.render("listings/new");
  }));
  
  // Show Route
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", 
      populate: {
      path: "author",
    }})
    .populate("owner");
    if(!listing) {
      req.flash("error", "Listing you requested for does not exist")
      res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  }));
  
  // Create route
  router.post("/", 
    validateListing, 
    isLoggedIn, 
    wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, location, country } = req.body;
    // let listing = req.body.listing;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
  
  }));
  
  // Edit Route
  router.get("/:id/edit", 
    isLoggedIn, 
    isOwner,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "Listing you requested for does not exist")
      res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  }));
  
  // Update Route
  router.put("/:id", 
    isLoggedIn, 
    isOwner,
    validateListing, 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);
  }));
  
  router.delete("/:id", 
    isLoggedIn,
    isOwner,  
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings");
  }));
  

  module.exports = router;