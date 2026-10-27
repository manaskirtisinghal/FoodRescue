const mongoose = require("mongoose");
const Claim = require("./Claim.js");
const Schema = mongoose.Schema;

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    type: {
      type: String,
      required: true,
      enum: ["Vegetarian", "Non-Vegetarian", "Vegan"]
    },

    location: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    availableUntil: {
      type: Date,
      required: true
    },

    providerName: {
      type: String,
      required: true
    },

    image: {
      type: String,
      default: "https://wallpapers.com/images/hd/food-4k-spdnpz7bhmx4kv2r.jpg",
      set: (value) => value === ""
        ? "https://wallpapers.com/images/hd/food-4k-spdnpz7bhmx4kv2r.jpg"
        : value
    },

    status: {
      type: String,
      enum: ["available", "expired", "claimed", "unavailable"],
      default: "available"
    }
  },
  {
    timestamps: true
  }
);

foodSchema.post("findOneAndDelete", async function (food) {
  if (food) {
    await Claim.deleteMany({ foodId: food._id });
  }
});

const Food = mongoose.model("Food",foodSchema);

module.exports = Food; 

