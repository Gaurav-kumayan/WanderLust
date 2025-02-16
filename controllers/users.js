const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const registerUser = await User.register(newuser, password);
        console.log(registerUser);
        req.login(registerUser , (err) =>{
        if (err){
            return next(err);
        }
        res.redirect("/listings");
        });
        
    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");

    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req , res) =>{
    req.flash("success" , "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings" 
    res.redirect(redirectUrl);

};
module.exports.logout =  (req , res ) =>{
    req.logout((err) =>{
        if(err){
            return next(err) ;
        }
        req.flash("success" , "logged you out!");
        res.redirect("/listings");
    });
};
