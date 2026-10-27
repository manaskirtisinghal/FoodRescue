const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true
    },

    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: ["claimed", "picked-up", "cancelled"],
      default: "claimed"
    },

    claimedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Claim", claimSchema);