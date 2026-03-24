// Define accessors (keys in your data)
const accessors = ["_id", "product", "category", "price", "stock", "rating"];

// Define headers (column names for display)
const headers = [
  "Product ID",
  "Product Name",
  "Category",
  "Price ($)",
  "Stock",
  "Rating",
];

// Export both so you can import them elsewhere
export { accessors, headers };

// Or, if you want a default export as an object
// export default { accessors, headers };
