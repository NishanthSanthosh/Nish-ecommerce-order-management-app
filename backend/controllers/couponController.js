const Coupon = require("./../models/couponModel");

exports.createCoupon = async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        coupon: newCoupon,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findById(req.params.id);

    if (!updatedCoupon) {
      return res.status(404).json({
        status: "fail",
        message: "Coupon not found",
      });
    }

    updatedCoupon.set(req.body);
    await updatedCoupon.save();

    res.status(200).json({
      status: "success",
      data: {
        coupon: updatedCoupon,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    res.status(200).json({
      status: "success",
      results: coupons.length,
      data: {
        coupons,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        status: "fail",
        message: "Coupon not found",
      });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
