const Order = require("./../models/orderModel");
const Product = require("./../models/productModel");
const Coupon = require("./../models/couponModel");
const User = require("./../models/userModel");

const roundMoney = (value) => Number(value.toFixed(2));

const buildOrderItems = async (rawItems = []) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error("An order must have at least one item");
  }

  const groupedItems = rawItems.reduce((itemsByProduct, item) => {
    const productId = item.productId;
    const quantity = Number(item.quantity);

    if (!productId) {
      throw new Error("Each order item must have a product");
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Each order item quantity must be a whole number");
    }

    itemsByProduct.set(productId, (itemsByProduct.get(productId) || 0) + quantity);
    return itemsByProduct;
  }, new Map());

  const orderItems = [];

  for (const [productId, quantity] of groupedItems.entries()) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Selected product was not found");
    }

    const unitPrice = Number(product.price);

    orderItems.push({
      productId: product._id,
      productName: product.product,
      quantity,
      unitPrice,
      lineTotal: roundMoney(unitPrice * quantity),
    });
  }

  return orderItems;
};

const buildCustomerSnapshot = async (customerId) => {
  if (!customerId) {
    throw new Error("Please select a customer");
  }

  const user = await User.findById(customerId);

  if (!user) {
    throw new Error("Selected customer was not found");
  }

  return {
    customerId: user._id,
    customerName: user.name,
    phone: user.phone,
  };
};

const getQuantityByProduct = (items = []) =>
  items.reduce((quantities, item) => {
    const productId = item.productId.toString();
    quantities[productId] = (quantities[productId] || 0) + Number(item.quantity);
    return quantities;
  }, {});

const getStockDeltas = (oldItems = [], newItems = []) => {
  const oldQuantities = getQuantityByProduct(oldItems);
  const newQuantities = getQuantityByProduct(newItems);
  const productIds = new Set([
    ...Object.keys(oldQuantities),
    ...Object.keys(newQuantities),
  ]);

  return Array.from(productIds)
    .map((productId) => ({
      productId,
      quantityChange:
        (newQuantities[productId] || 0) - (oldQuantities[productId] || 0),
    }))
    .filter((delta) => delta.quantityChange !== 0);
};

const rollbackStockDeltas = async (appliedDeltas) => {
  for (const delta of appliedDeltas.reverse()) {
    await Product.findByIdAndUpdate(delta.productId, {
      $inc: { stock: delta.quantityChange },
    });
  }
};

const applyStockDeltas = async (deltas) => {
  const appliedDeltas = [];

  try {
    for (const delta of deltas) {
      if (delta.quantityChange > 0) {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: delta.productId, stock: { $gte: delta.quantityChange } },
          { $inc: { stock: -delta.quantityChange } },
          { new: true, runValidators: true },
        );

        if (!updatedProduct) {
          throw new Error("Order quantity exceeds available product stock");
        }

        appliedDeltas.push({
          productId: delta.productId,
          quantityChange: delta.quantityChange,
        });
      } else {
        await Product.findByIdAndUpdate(
          delta.productId,
          { $inc: { stock: Math.abs(delta.quantityChange) } },
          { runValidators: true },
        );
        appliedDeltas.push({
          productId: delta.productId,
          quantityChange: delta.quantityChange,
        });
      }
    }
  } catch (err) {
    await rollbackStockDeltas(appliedDeltas);
    throw err;
  }
};

const calculateCouponDiscount = async (
  couponCode,
  subtotal,
  { allowExistingUsage = false } = {},
) => {
  if (!couponCode?.trim()) {
    return {
      couponId: undefined,
      couponCode: undefined,
      discountAmount: 0,
    };
  }

  const coupon = await Coupon.findOne({
    code: couponCode.trim().toUpperCase(),
  });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  const now = new Date();

  if (coupon.status !== "Active") {
    throw new Error("Coupon is inactive");
  }

  if (now < coupon.startDate || now > coupon.expiryDate) {
    throw new Error("Coupon is not valid for today's date");
  }

  if (!allowExistingUsage && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  if (subtotal < coupon.minOrderAmount) {
    throw new Error(
      `Minimum order amount for this coupon is ${coupon.minOrderAmount}`,
    );
  }

  const discountAmount =
    coupon.discountType === "Percentage"
      ? roundMoney((subtotal * coupon.discountValue) / 100)
      : Number(coupon.discountValue);

  return {
    couponId: coupon._id,
    couponCode: coupon.code,
    discountAmount: Math.min(discountAmount, subtotal),
  };
};

const adjustCouponUsage = async (oldCouponCode, newCouponCode) => {
  const normalizedOldCode = oldCouponCode?.trim().toUpperCase();
  const normalizedNewCode = newCouponCode?.trim().toUpperCase();

  if (normalizedOldCode === normalizedNewCode) return;

  if (normalizedOldCode) {
    await Coupon.findOneAndUpdate(
      { code: normalizedOldCode, usedCount: { $gt: 0 } },
      { $inc: { usedCount: -1 } },
    );
  }

  if (normalizedNewCode) {
    await Coupon.findOneAndUpdate(
      { code: normalizedNewCode },
      { $inc: { usedCount: 1 } },
      { runValidators: true },
    );
  }
};

const getOrderPayload = (req, customer, items, subtotal, couponDetails) => ({
  customerId: customer.customerId,
  customerName: customer.customerName,
  phone: customer.phone,
  address: req.body.address,
  items,
  subtotal,
  couponId: couponDetails.couponId,
  couponCode: couponDetails.couponCode,
  discountAmount: couponDetails.discountAmount,
  totalAmount: roundMoney(subtotal - couponDetails.discountAmount),
  paymentMethod: req.body.paymentMethod,
  paymentStatus: req.body.paymentStatus,
  orderStatus: req.body.orderStatus,
});

exports.createOrder = async (req, res) => {
  try {
    const customer = await buildCustomerSnapshot(req.body.customerId);
    const items = await buildOrderItems(req.body.items);
    const subtotal = roundMoney(
      items.reduce((sum, item) => sum + item.lineTotal, 0),
    );
    const couponDetails = await calculateCouponDiscount(
      req.body.couponCode,
      subtotal,
    );
    const stockDeltas = getStockDeltas([], items);

    await applyStockDeltas(stockDeltas);

    let newOrder;

    try {
      newOrder = await Order.create(
        getOrderPayload(req, customer, items, subtotal, couponDetails),
      );
      await adjustCouponUsage(undefined, couponDetails.couponCode);
    } catch (err) {
      await rollbackStockDeltas(stockDeltas);
      throw err;
    }

    res.status(201).json({
      status: "success",
      data: {
        order: newOrder,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }

    const customer = await buildCustomerSnapshot(req.body.customerId);
    const items = await buildOrderItems(req.body.items);
    const subtotal = roundMoney(
      items.reduce((sum, item) => sum + item.lineTotal, 0),
    );
    const couponDetails = await calculateCouponDiscount(
      req.body.couponCode,
      subtotal,
      {
        allowExistingUsage:
          order.couponCode?.toUpperCase() === req.body.couponCode?.toUpperCase(),
      },
    );
    const stockDeltas = getStockDeltas(order.items, items);

    await applyStockDeltas(stockDeltas);

    try {
      const oldCouponCode = order.couponCode;
      order.set(getOrderPayload(req, customer, items, subtotal, couponDetails));
      await order.save();
      await adjustCouponUsage(oldCouponCode, couponDetails.couponCode);
    } catch (err) {
      await rollbackStockDeltas(stockDeltas);
      throw err;
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }

    const stockDeltas = getStockDeltas(order.items, []);

    await applyStockDeltas(stockDeltas);

    try {
      await Order.findByIdAndDelete(req.params.id);
      await adjustCouponUsage(order.couponCode, undefined);
    } catch (err) {
      await rollbackStockDeltas(stockDeltas);
      throw err;
    }

    res.status(204).json({
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
