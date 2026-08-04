const categoryFields = [
  {
    name: "category",
    label: "Category Name",
    placeholder: "e.g., Vegetables",
    validation: {
      required: "Category name is required",
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
];

export default categoryFields;
