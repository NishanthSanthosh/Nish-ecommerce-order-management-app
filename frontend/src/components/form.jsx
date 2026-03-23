import { Box, TextField, Button, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";

const ReusableForm = ({
  fields,
  register,
  control,
  errors,
  onSubmit,
  submitLabel,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {fields.map((field) =>
        field.type === "select" ? (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                select
                label={field.label}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
              >
                {field.options.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        ) : (
          <TextField
            key={field.name}
            label={field.label}
            type={field.type || "text"}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
            inputProps={field.inputProps}
            {...register(field.name, field.validation)}
          />
        ),
      )}

      <Button
        type="submit"
        variant="contained"
        sx={{ backgroundColor: "black" }}
      >
        {submitLabel}
      </Button>
    </Box>
  );
};

export default ReusableForm;
