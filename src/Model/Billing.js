const mongoose = require('mongoose');
const Bill = new mongoose.Schema(
  {
    Email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    BillingID: {
      type: String,
      trim: true,
    },
    UserID: {
      type: String,
      trim: true,
    },
    Name: {
      type: String,
      trim: true,
    },
    Number: {
      type: String,
      trim: true,
    },
    City: {
      type: String,
      trim: true,
    },
    State: {
      type: String,
      trim: true,
    },
    Address: {
      type: String,
      trim: true,
    },
    Landmark: {
      type: String,
      trim: true,
    },
    PostalCode: {
      type: String,
      trim: true,
    },
    Latitude: { type: Number, trim: true },
    Longitude: { type: Number, trim: true },
    IsActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("billingAddress", Bill)