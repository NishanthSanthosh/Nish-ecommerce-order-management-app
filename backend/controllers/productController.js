const Product = require("./../models/productModel");
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    console.log("hello");
    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!)",
    });
  }
};
