const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product: {
    type: String,
    required: [true, "A product must have a name"],
    unique: true,
  },
  category: {
    type: String,
    required: [true, "A product must have a category"],
  },
  price: {
    type: Number,
    required: [true, "A product must have a price"],
  },
  stock: {
    type: Number,
    required: [true, "A product must have a stock"],
    min: [0, "Product stock cannot be negative"],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
