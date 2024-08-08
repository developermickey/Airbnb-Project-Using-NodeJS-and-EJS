const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");



// const validateListing = (req, res, next) => {
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//       let errMsg = error.details.map((el) => el.message).join(",");
//       throw new ExpressError(400, errMsg);
//     }else{
//       next();
//     }
//   };

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      return next(new ExpressError(400, errMsg));
  } else {
      next();
  }
};


// All Listings Route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }));
  
  // New Route
  router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/new");
  }));
  
  // Show Route
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
      req.flash("error", "Listing you requested for does not exist")
      res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  }));
  
  // Create route
  router.post("/", 
    validateListing, 
    wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, location, country } = req.body;
    // let listing = req.body.listing;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
  
  }));
  
  // Edit Route
  router.get("/:id/edit", 
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
    validateListing, 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);
  }));
  
  router.delete("/:id", 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings");
  }));
  
  
  


  module.exports = router;