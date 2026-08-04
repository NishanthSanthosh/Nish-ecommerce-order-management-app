import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";

export default function PagePlaceholder({
  eyebrow,
  title,
  description,
  actionLabel,
  stats = [],
}) {
  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          border: "1px solid #e5e7eb",
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(20, 184, 166, 0.08), rgba(255, 255, 255, 0.95))",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="overline" color="text.secondary" fontWeight={800}>
              {eyebrow}
            </Typography>
            <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
              {description}
            </Typography>
          </Box>
          {actionLabel && (
            <Button
              variant="contained"
              sx={{
                alignSelf: { xs: "stretch", md: "center" },
                bgcolor: "#0f766e",
                borderRadius: 2,
                px: 3,
                py: 1.25,
                fontWeight: 800,
                boxShadow: "0 12px 24px rgba(15, 118, 110, 0.2)",
                "&:hover": { bgcolor: "#115e59" },
              }}
            >
              {actionLabel}
            </Button>
          )}
        </Stack>
      </Paper>

      {stats.length > 0 && (
        <Grid container spacing={2.5}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  border: "1px solid #e5e7eb",
                  borderRadius: 4,
                  height: "100%",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.helper}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
