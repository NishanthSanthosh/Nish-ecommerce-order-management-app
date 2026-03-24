const express = require("express");
const productRouter = require("./routes/productRoutes");
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/version1/products", productRouter);
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
