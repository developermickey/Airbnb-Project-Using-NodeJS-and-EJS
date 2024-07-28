const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

const Listing = require("./models/listing");
// MongoDB Configuration
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main()
  .then(() => {
    console.log("Mongo database connected");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// MongoDB Configuration End 

// / Home Route
app.get("/", (req, res) => {
  res.send("Home");
});
// All Listings Route
app.get("/listings", wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// New Route
app.get("/listings/new", wrapAsync(async (req, res) => {
  res.render("listings/new");
}));

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
}));

// Create route
app.post("/listings", wrapAsync(async (req, res, next) => {
  // let {title, description, image, price, location, country } = req.body;
  // let listing = req.body.listing;

    if(!req.body.listing){
        throw new ExpressError(400, "Send Vaild Data For Listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
}));

// Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Send Vaild Data For Listing");
    }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

// app.get("/testlisting", wrapAsync(async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Village",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });
// await sampleListing.save();
// console.log("sample was saved");
// res.send("Success!");
// }));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let {statusCode=500, message = "Something Went Wrong" } = err;
  res.status(statusCode).res.render("error", {err});
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
