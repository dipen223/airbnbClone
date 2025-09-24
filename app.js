if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo')
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const flash = require("connect-flash");

const passport = require("passport");
const localStrategy = require("passport-local");
const User  = require("./models/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/myairbnb";
const dbUrl  = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"mysupersecretcode"
    },
    touchAfter:24*60*60,
});

store.on("error",() =>{
    console.log("error in mongo session store",err);
})
const sessionOptions = {
    store,
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    next();
});

// app.get("/demouser",async (req,res) =>{
//     let fakeUser = new User({
//         email:"teacher@gmail.com",
//         username:"teacher223",
//     });

//    let registeredUser = await  User.register(fakeUser,"12134");
//    res.send(registeredUser);
// // });




app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//I am getting an errro whenever i am trying to use this.
// app.all("*",(req,res,next) =>{
//     next(new expressError(404,"Page Not Found"));
// });

// Reviews 
//  ~post route

app.use((req, res, next) => {
    res.status(404).send("Page Not Found");
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
