const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Food = require("../models/Food.js");
const MONGO_URL = process.env.MONGO_URI;

main()
    .then((res)=>{
        console.log("Connection Successful!");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initializeData = async () =>{
    await Food.deleteMany({});
    await Food.insertMany(initData.data);
    console.log("Data Initialized");
};

initializeData();
