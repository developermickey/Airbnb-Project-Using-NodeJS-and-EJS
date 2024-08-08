const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require('connect-flash');

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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOption = {
  secret: "supersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires:  Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}

app.use(session(sessionOption));
app.use(flash());



const listings = require("./routes/listing");
const reviews = require("./routes/review");

// / Home Route
app.get("/", (req, res) => {
  res.send("Home");
});


app.use((req, res, next ) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);



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

// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something Went Wrong" } = err;
//   res.status(statusCode).res.render("error", { err });
// });

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error", { err });
});


app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
