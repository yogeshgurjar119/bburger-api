const mongoose = require('mongoose');
const Feed = new mongoose.Schema(
  {
    Email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    UserID: {
      type: String,
      trim: true,
    },
    Name: {
      type: String,
      trim: true,
    },
    Password: {
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
module.exports = mongoose.model("users", Feed)