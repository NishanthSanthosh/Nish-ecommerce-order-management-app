const orderFields = [
  {
    name: "customerId",
    label: "Customer",
    type: "select",
    options: [],
    validation: {
      required: "Please select a customer",
    },
  },
  {
    name: "address",
    label: "Delivery Address",
    placeholder: "Street, city, state, zip code",
    multiline: true,
    rows: 3,
    validation: {
      required: "Delivery address is required",
      minLength: { value: 8, message: "Enter a complete address" },
      maxLength: { value: 200, message: "Maximum 200 characters" },
    },
  },
  {
    name: "couponCode",
    label: "Coupon Code",
    placeholder: "e.g., SAVE10",
    helperText: "Optional. Discount is validated and applied by the backend.",
    validation: {
      pattern: {
        value: /^[a-zA-Z0-9_-]*$/,
        message: "Only letters, numbers, underscores, and dashes allowed",
      },
    },
  },
  {
    name: "paymentMethod",
    label: "Payment Method",
    type: "select",
    options: [
      { label: "Cash", value: "Cash" },
      { label: "Card", value: "Card" },
      { label: "UPI", value: "UPI" },
    ],
    validation: {
      required: "Please select a payment method",
    },
  },
  {
    name: "paymentStatus",
    label: "Payment Status",
    type: "select",
    options: [
      { label: "Pending", value: "Pending" },
      { label: "Paid", value: "Paid" },
      { label: "Failed", value: "Failed" },
      { label: "Refunded", value: "Refunded" },
    ],
    validation: {
      required: "Please select a payment status",
    },
  },
  {
    name: "orderStatus",
    label: "Order Status",
    type: "select",
    options: [
      { label: "Pending", value: "Pending" },
      { label: "Confirmed", value: "Confirmed" },
      { label: "Packed", value: "Packed" },
      { label: "Out for Delivery", value: "Out for Delivery" },
      { label: "Delivered", value: "Delivered" },
      { label: "Cancelled", value: "Cancelled" },
    ],
    validation: {
      required: "Please select an order status",
    },
  },
];

export default orderFields;
