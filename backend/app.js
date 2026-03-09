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
module.exports = app;
