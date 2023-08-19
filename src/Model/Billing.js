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
    PostalCode: {
      type: String,
      trim: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("billingAddress", Bill)