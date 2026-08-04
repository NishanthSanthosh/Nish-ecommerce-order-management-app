const Category = require("./../models/categoryModel");

exports.createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        category: newCategory,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        category: updatedCategory,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
    }

    res.status(204).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
