import { Box, TextField, Button, MenuItem } from "@mui/material";

const ReusableForm = ({ fields, register, errors, onSubmit, submitLabel }) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {fields.map((field) => (
        <TextField
          key={field.name}
          label={field.label}
          type={field.type || "text"}
          select={field.type === "select"}
          error={!!errors[field.name]}
          helperText={errors[field.name]?.message}
          {...register(field.name, field.validation)}
        >
          {field.type === "select" &&
            field.options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
        </TextField>
      ))}
      <Button
        type="submit"
        variant="contained"
        sx={{ backgroundColor: "#0b7285" }}
      >
        {submitLabel}
      </Button>
    </Box>
  );
};
export default ReusableForm;
