const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
    console.log(listing.owner.username);
};


module.exports.createListing = async (req, res) => {
     let response =  await geocodingClient.forwardGeocode({
        query: req.body.Listing.location,
        limit: 1,
      })
        .send()
    

    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "...", filename);
    const newlisting = new Listing(req.body.Listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };

    newlisting.geometry = response.body.features[0].geometry;
    
        let saved=   await newlisting.save();
      console.log(saved);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    console.log(id);

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings");
    }
    let orignalImageUrl =  listing.image.url;
     orignalImageUrl =  orignalImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listings/edit.ejs", { listing , orignalImageUrl });
};

module.exports.updateListing = async (req, res) => {

    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
       await listing.save();
    }
    req.flash("success", "Listing Edited");
    res.redirect(`/listings/${id}`);

};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    req.flash("success", "Listing Deleted");
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
};