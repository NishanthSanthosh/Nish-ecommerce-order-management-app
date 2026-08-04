import { Box, TextField, Button, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";

const ReusableForm = ({
  fields,
  register,
  control,
  errors,
  onSubmit,
  submitLabel,
  children,
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
            defaultValue=""
            rules={field.validation}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                value={controllerField.value ?? ""}
                select
                label={field.label}
                disabled={field.disabled}
                placeholder={field.placeholder}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message || field.helperText}
              >
                {(field.options || []).map((opt) => (
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
            disabled={field.disabled}
            placeholder={field.placeholder}
            multiline={field.multiline}
            rows={field.rows}
            InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message || field.helperText}
            inputProps={field.inputProps}
            {...register(field.name, field.validation)}
          />
        ),
      )}

      {children}

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
