const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "store-settings",
      unique: true,
      immutable: true,
    },
    storeName: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      default: "Nish Groceries",
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      lowercase: true,
      trim: true,
      default: "support@nishgroceries.com",
    },
    supportPhone: {
      type: String,
      required: [true, "Support phone is required"],
      trim: true,
      default: "0000000000",
    },
    storeAddress: {
      type: String,
      required: [true, "Store address is required"],
      trim: true,
      default: "Update store address",
    },
    currency: {
      type: String,
      enum: ["USD", "INR"],
      default: "USD",
    },
    deliveryFee: {
      type: Number,
      min: [0, "Delivery fee cannot be negative"],
      default: 0,
    },
    taxRate: {
      type: Number,
      min: [0, "Tax rate cannot be negative"],
      max: [100, "Tax rate cannot exceed 100"],
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  { timestamps: true },
);

const Settings = mongoose.model("Settings", settingsSchema);
module.exports = Settings;
