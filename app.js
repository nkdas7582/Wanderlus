if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}
console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./Utils/expressError.js");

const User = require("./Models/user.js");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js"); // ✅ Corrected name
const userRoutes = require("./routes/user.js");


const dbUrl=process.env.ATLASDB_url;

const store=MongoStore.create({
    mongoUrl:dbUrl ,
    crypto: {
    secret:process.env.SECRET,
  },
   touchAfter:24 * 3600,
  });
store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE", err);
});
// Session Configuration
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 14 * 24 * 60 * 60 * 1000,
    maxAge: 14 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


// DB Connection
async function main() {
  await mongoose.connect(dbUrl);
  console.log("✅ Connected to MongoDB");
}
main().catch((err) => console.log(err));

// View Engine and Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));
app.use(flash());

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + Current User Middleware
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.warningMsg = req.flash("error");
  res.locals.currentuser = req.user;
  next();
});

// Mount Routes
app.use("/", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes); // ✅ Review route properly mounted

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// 404 Handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error Handler
app.use((err, req, res, next) => {
  const { statuscode = 500, message = "Something went wrong!" } = err;
  res.status(statuscode).render("listings/error.ejs", { message });
});

// Start Server
app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
});
