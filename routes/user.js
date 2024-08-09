const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js');

router.get("/signup", (req, res) => {
    res.render('users/signup');
});

router.post("/signup", 
    wrapAsync(async (req, res) => {
    try {
        let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err);
        }else {
            req.flash("success", "Welcome To AirBnb");
            res.redirect('/listings');
        }
    })

    } catch (e) {
       req.flash("error", e.message);
       res.redirect("/signup");
    }

}));


router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post(
    "/login", 
    saveRedirectUrl,
    passport.authenticate("local", {
    failureRedirect: "/login", 
    failureFlash: true
    }), 
    async (req, res) => {
        req.flash("success", "Welcome to AirBnb Your are logged in!")
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    });




    // Logout 

    router.get("/logout", (req, res, next) => {
        req.logout((err) => {
            if(err) {
                return next(err);
            }else {
                req.flash("success", "you are logged out!")
                res.redirect("/listings");
            }
        });

    });

module.exports = router;