const couponFields = [
  {
    name: "code",
    label: "Coupon Code",
    placeholder: "e.g., SAVE10",
    validation: {
      required: "Coupon code is required",
      minLength: { value: 3, message: "Minimum 3 characters" },
      maxLength: { value: 20, message: "Maximum 20 characters" },
      pattern: {
        value: /^[a-zA-Z0-9_-]+$/,
        message: "Only letters, numbers, underscores, and dashes allowed",
      },
    },
  },
  {
    name: "description",
    label: "Description",
    placeholder: "e.g., 10% off grocery orders",
    multiline: true,
    rows: 2,
    validation: {
      maxLength: { value: 120, message: "Maximum 120 characters" },
    },
  },
  {
    name: "discountType",
    label: "Discount Type",
    type: "select",
    options: [
      { label: "Percentage", value: "Percentage" },
      { label: "Fixed", value: "Fixed" },
    ],
    validation: {
      required: "Please select a discount type",
    },
  },
  {
    name: "discountValue",
    label: "Discount Value",
    type: "number",
    inputProps: { step: "0.01", min: "0.01" },
    validation: {
      required: "Discount value is required",
      min: { value: 0.01, message: "Discount must be greater than 0" },
    },
  },
  {
    name: "minOrderAmount",
    label: "Minimum Order Amount",
    type: "number",
    inputProps: { step: "0.01", min: "0" },
    validation: {
      required: "Minimum order amount is required",
      min: { value: 0, message: "Minimum order amount cannot be negative" },
    },
  },
  {
    name: "usageLimit",
    label: "Usage Limit",
    type: "number",
    inputProps: { min: "1" },
    validation: {
      required: "Usage limit is required",
      min: { value: 1, message: "Usage limit must be at least 1" },
      validate: (value) =>
        Number.isInteger(Number(value)) || "Usage limit must be a whole number",
    },
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    validation: {
      required: "Start date is required",
    },
  },
  {
    name: "expiryDate",
    label: "Expiry Date",
    type: "date",
    validation: {
      required: "Expiry date is required",
    },
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
    validation: {
      required: "Please select a status",
    },
  },
];

export default couponFields;
