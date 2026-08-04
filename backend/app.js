const express = require("express");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const orderRouter = require("./routes/orderRoutes");
const userRouter = require("./routes/userRoutes");
const couponRouter = require("./routes/couponRoutes");
const settingsRouter = require("./routes/settingsRoutes");
const authRouter = require("./routes/authRoutes");
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/version1/auth", authRouter);
app.use("/api/version1/products", productRouter);
app.use("/api/version1/categories", categoryRouter);
app.use("/api/version1/orders", orderRouter);
app.use("/api/version1/users", userRouter);
app.use("/api/version1/coupons", couponRouter);
app.use("/api/version1/settings", settingsRouter);
app.use((req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} in this server!`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
module.exports = app;
