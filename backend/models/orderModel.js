const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "An order must have a customer"],
    },
    customerName: {
      type: String,
      required: [true, "An order must have a customer name"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "An order must have a phone number"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "An order must have a delivery address"],
      trim: true,
    },
    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "An order item must have a product"],
          },
          productName: {
            type: String,
            required: [true, "An order item must have a product name"],
            trim: true,
          },
          quantity: {
            type: Number,
            required: [true, "An order item must have a quantity"],
            min: [1, "Quantity must be at least 1"],
          },
          unitPrice: {
            type: Number,
            required: [true, "An order item must have a unit price"],
            min: [0, "Unit price cannot be negative"],
          },
          lineTotal: {
            type: Number,
            required: [true, "An order item must have a line total"],
            min: [0, "Line total cannot be negative"],
          },
        },
      ],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "An order must have at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: [true, "An order must have a subtotal"],
      min: [0, "Subtotal cannot be negative"],
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    couponCode: {
      type: String,
      uppercase: true,
      trim: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, "Discount amount cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: [true, "An order must have a total amount"],
      min: [0, "Total amount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      required: [true, "An order must have a payment method"],
      enum: ["Cash", "Card", "UPI"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
