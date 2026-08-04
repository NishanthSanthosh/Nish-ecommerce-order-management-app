const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "A user must have a phone number"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "A user must have an address"],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "A user must have a password"],
      select: false,
    },
    createdBy: {
      type: String,
      enum: ["admin", "self"],
      default: "admin",
    },
    role: {
      type: String,
      enum: ["Customer", "Admin"],
      default: "Customer",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
