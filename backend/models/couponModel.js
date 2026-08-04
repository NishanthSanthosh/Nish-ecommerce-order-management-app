const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "A coupon must have a code"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountType: {
      type: String,
      required: [true, "A coupon must have a discount type"],
      enum: ["Percentage", "Fixed"],
    },
    discountValue: {
      type: Number,
      required: [true, "A coupon must have a discount value"],
      min: [0.01, "Discount value must be greater than 0"],
      validate: {
        validator(value) {
          return this.discountType !== "Percentage" || value <= 100;
        },
        message: "Percentage discount cannot exceed 100",
      },
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "Minimum order amount cannot be negative"],
    },
    usageLimit: {
      type: Number,
      required: [true, "A coupon must have a usage limit"],
      min: [1, "Usage limit must be at least 1"],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, "Used count cannot be negative"],
    },
    startDate: {
      type: Date,
      required: [true, "A coupon must have a start date"],
    },
    expiryDate: {
      type: Date,
      required: [true, "A coupon must have an expiry date"],
      validate: {
        validator(value) {
          return !this.startDate || value >= this.startDate;
        },
        message: "Expiry date must be after start date",
      },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
