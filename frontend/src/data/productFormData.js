const productFields = [
  {
    name: "product",
    label: "Product Name",
    placeholder: "e.g., Organic Red Apples",
    validation: {
      required: "Product name is required",
      minLength: { value: 3, message: "Minimum 3 characters" },
      maxLength: { value: 50, message: "Maximum 50 characters" },
      pattern: {
        value: /^[a-zA-Z0-9\s&'-]+$/,
        message: "Only alphanumeric characters allowed",
      },
      validate: (value) =>
        value.trim().length >= 3 || "Name cannot be just spaces",
    },
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Vegetables", value: "Vegetables" },
      { label: "Fruits", value: "Fruits" },
      { label: "Dairy", value: "Dairy" },
    ],
    validation: {
      required: "Please select a category",
    },
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    inputProps: { step: "0.01", min: "0" },
    validation: {
      required: "Price is required",
      min: { value: 0.01, message: "Price must be at least 0.01" },
      max: { value: 100, message: "Price exceeds maximum limit" },
      pattern: {
        value: /^\d+(\.\d{1,2})?$/,
        message: "Maximum 2 decimal places allowed",
      },
    },
  },
  {
    name: "stock",
    label: "Stock Quantity",
    type: "number",
    validation: {
      required: "Stock is required",
      min: { value: 0, message: "Stock cannot be negative" },
      max: { value: 99999, message: "Stock exceeds warehouse capacity" },
      validate: (value) =>
        Number.isInteger(Number(value)) || "Stock must be a whole number",
    },
  },
];

export default productFields;
