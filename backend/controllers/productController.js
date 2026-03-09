const Product = require("./../models/productModel");
exports.createProduct = async (req, res) => {
  try {
    console.log(req.body);
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
      message: err,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    // console.log(req.body);
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products: products,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
