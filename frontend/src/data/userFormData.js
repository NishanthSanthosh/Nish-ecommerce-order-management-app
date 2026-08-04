const userFields = [
  {
    name: "name",
    label: "Full Name",
    placeholder: "e.g., John Smith",
    validation: {
      required: "Name is required",
      minLength: { value: 3, message: "Minimum 3 characters" },
      maxLength: { value: 60, message: "Maximum 60 characters" },
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "e.g., john@example.com",
    validation: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email",
      },
    },
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "e.g., 9876543210",
    validation: {
      required: "Phone number is required",
      pattern: {
        value: /^[0-9+\-\s()]{7,20}$/,
        message: "Enter a valid phone number",
      },
    },
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Street, city, state, zip code",
    multiline: true,
    rows: 3,
    validation: {
      required: "Address is required",
      minLength: { value: 8, message: "Enter a complete address" },
      maxLength: { value: 200, message: "Maximum 200 characters" },
    },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    helperText: "Required when creating. Leave blank while editing to keep current password.",
    validation: {
      minLength: { value: 6, message: "Minimum 6 characters" },
    },
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Customer", value: "Customer" },
      { label: "Admin", value: "Admin" },
    ],
    validation: {
      required: "Please select a role",
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

export default userFields;
