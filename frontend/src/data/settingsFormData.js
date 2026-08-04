const settingsFields = [
  {
    name: "storeName",
    label: "Store Name",
    placeholder: "e.g., Nish Groceries",
    validation: {
      required: "Store name is required",
      minLength: { value: 3, message: "Minimum 3 characters" },
      maxLength: { value: 80, message: "Maximum 80 characters" },
    },
  },
  {
    name: "contactEmail",
    label: "Contact Email",
    type: "email",
    placeholder: "e.g., support@example.com",
    validation: {
      required: "Contact email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email",
      },
    },
  },
  {
    name: "supportPhone",
    label: "Support Phone",
    placeholder: "e.g., 9876543210",
    validation: {
      required: "Support phone is required",
      pattern: {
        value: /^[0-9+\-\s()]{7,20}$/,
        message: "Enter a valid phone number",
      },
    },
  },
  {
    name: "storeAddress",
    label: "Store Address",
    placeholder: "Street, city, state, zip code",
    multiline: true,
    rows: 3,
    validation: {
      required: "Store address is required",
      minLength: { value: 8, message: "Enter a complete address" },
      maxLength: { value: 200, message: "Maximum 200 characters" },
    },
  },
  {
    name: "currency",
    label: "Currency",
    type: "select",
    options: [
      { label: "USD", value: "USD" },
      { label: "INR", value: "INR" },
    ],
    validation: {
      required: "Please select a currency",
    },
  },
  {
    name: "deliveryFee",
    label: "Delivery Fee",
    type: "number",
    inputProps: { step: "0.01", min: "0" },
    validation: {
      required: "Delivery fee is required",
      min: { value: 0, message: "Delivery fee cannot be negative" },
    },
  },
  {
    name: "taxRate",
    label: "Tax Rate (%)",
    type: "number",
    inputProps: { step: "0.01", min: "0", max: "100" },
    validation: {
      required: "Tax rate is required",
      min: { value: 0, message: "Tax rate cannot be negative" },
      max: { value: 100, message: "Tax rate cannot exceed 100" },
    },
  },
  {
    name: "orderStatus",
    label: "Accepting Orders",
    type: "select",
    options: [
      { label: "Open", value: "Open" },
      { label: "Closed", value: "Closed" },
    ],
    validation: {
      required: "Please select order status",
    },
  },
];

export default settingsFields;
