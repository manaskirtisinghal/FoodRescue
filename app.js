require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Food = require("./models/Food.js");
const Claim = require("./models/Claim.js");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URI;
const ejsMate = require("ejs-mate");
const {foodSchema} = require("./schema.js");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine("ejs", ejsMate);

main()
    .then((res)=>{
        console.log("Database Connection Successful!");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const validateListing = (req,res,next)=>{
    let { error } = foodSchema.validate(req.body.food);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(", ");
        return next(new ExpressError(400, errMsg));
    }
    next();
};

const isExpired = (date) => {
    const availableThrough = new Date(date);
    availableThrough.setUTCHours(23, 59, 59, 999);
    return availableThrough < new Date();
};

app.get("/",(req,res)=>{
    res.send("Root Page");
});


//Get All food and Search Bar 
app.get("/foods", wrapAsync(async (req, res) => {
    const { q } = req.query;

    const foods = q
        ? await Food.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } }
            ]
        })
        : await Food.find({});

    res.render("./foods/index.ejs", { foods, q });
}));

//Add food
app.get("/foods/new",wrapAsync(async (req,res) => {
    res.render("./foods/new.ejs");
}));

app.post("/foods",validateListing,wrapAsync(async(req,res)=>{
    const newListing = new Food({
        ...req.body.food,
        status: isExpired(req.body.food.availableUntil) ? "expired" : "available"
    });
    await newListing.save();
    res.redirect("/foods");
}));

//All claims
app.get("/foods/claims",wrapAsync( async(req,res)=>{
    const claims = await Claim.find({});
    res.render("./claims/index.ejs",{claims});
}));

//Impact dashboard
app.get("/dashboard",wrapAsync(async(req,res)=>{
    const [foodPosts, claimCount, rescuedServings] = await Promise.all([
        Food.countDocuments({}),
        Claim.countDocuments({ status: { $in: ["claimed", "picked-up"] } }),
        Claim.aggregate([
            { $match: { status: "picked-up" } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ])
    ]);
    res.render("./dashboard/index.ejs", {
        foodPosts,
        claimCount,
        servingsRescued: rescuedServings[0]?.total || 0
    });
}));

//Show food
app.get("/foods/:id",wrapAsync(async (req,res) => {
    let {id} = req.params;
    let food = await Food.findById(id);
    res.render("./foods/show.ejs",{food});
}));

//Update Food info
app.get("/foods/:id/edit",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    const food = await Food.findById(id);
    res.render("./foods/edit.ejs",{food});
}));

app.put("/foods/:id",validateListing,wrapAsync( async(req,res)=>{
    let {id} = req.params;
    const updatedFood = { ...req.body.food };
    if (Number(updatedFood.quantity) <= 0) {
        updatedFood.status = "unavailable";
    } else if (isExpired(updatedFood.availableUntil)) {
        updatedFood.status = "expired";
    } else {
        updatedFood.status = "available";
    }
    await Food.findByIdAndUpdate(id,updatedFood,{ runValidators: true });
    res.redirect(`/foods/${id}`);
}));

//Delete food item 
app.delete("/foods/:id",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    await Food.findByIdAndDelete(id);
    res.redirect("/foods");
}));

//Claim
//Create: User claims food. Then, check food availabilty and reduce food quantity
app.post("/foods/:id/claim",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let food = await Food.findById(id);
    if (!food) {
        throw new ExpressError(404, "Food listing not found.");
    }
    if (food.quantity < 1 || !food.availableUntil || isExpired(food.availableUntil)) {
        food.status = food.quantity < 1 ? "unavailable" : "expired";
        await food.save();
        throw new ExpressError(400, "This food item is not available for claiming.");
    }
    food.status = "available";
    const userName = req.body.claim?.userName?.trim();
    if (!userName) {
        throw new ExpressError(400, "Your name is required to claim this food.");
    }
    let claim = new Claim({ userName, foodId: food._id, quantity: 0 });
    claim.quantity += 1;
    food.quantity -= 1;
    if (food.quantity === 0) {
        food.status = "unavailable";
    }
    await food.save();
    await claim.save();
    res.redirect(`/foods/${id}`);
}));

//Read claims above before id

/*If none of routes match*/
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found.Please check!!"));
});

/*wrapAsync sends rejected promise here*/
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const statusCode = err.statusCode || 500;
    res.status(statusCode).render("error.ejs", {
        statusCode,
        message: err.message || "Something went wrong. Please try again."
    });
});

app.listen(PORT,()=>{
    console.log(`App is listening on port ${PORT}`);
});
