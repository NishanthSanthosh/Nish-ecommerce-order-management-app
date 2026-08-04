const express = require("express");
const couponController = require("./../controllers/couponController");

const router = express.Router();

router
  .route("/")
  .get(couponController.getAllCoupons)
  .post(couponController.createCoupon);

router
  .route("/:id")
  .delete(couponController.deleteCoupon)
  .patch(couponController.updateCoupon);

module.exports = router;
