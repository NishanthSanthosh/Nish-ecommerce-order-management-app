import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

const ReusableTable = ({ headers, data, accessors, onEdit, onDelete }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
      }}
    >
      <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
        <Table
          sx={{
            minWidth: { xs: 760, md: 720 },
            "& th, & td": {
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1.25, sm: 1.75 },
              whiteSpace: "nowrap",
            },
          }}
        >
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8fafc" }}>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    borderBottom: "1px solid #e5e7eb",
                    color: "#475569",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {header}
                </TableCell>
              ))}

              {(onEdit || onDelete) && (
                <TableCell
                  sx={{
                    borderBottom: "1px solid #e5e7eb",
                    color: "#475569",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={headers.length + (onEdit || onDelete ? 1 : 0)}
                  sx={{ py: 6, textAlign: "center" }}
                >
                  <Typography color="text.secondary">
                    No records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {data.map((row, rowIndex) => (
              <TableRow
                key={row._id || rowIndex}
                hover
                sx={{
                  "&:last-child td": { borderBottom: 0 },
                  "& td": {
                    borderBottom: "1px solid #eef2f7",
                    color: "#334155",
                  },
                }}
              >
                {accessors.map((key, colIndex) => (
                  <TableCell key={colIndex}>{row[key] ?? "-"}</TableCell>
                ))}

                {(onEdit || onDelete) && (
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {onEdit && (
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(row)}
                        size="small"
                        sx={{ bgcolor: "#eff6ff", mr: 0.75 }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}

                    {onDelete && (
                      <IconButton
                        color="error"
                        onClick={() => {
                          const itemName =
                            row.product ||
                            row.category ||
                            row.customerName ||
                            row.name ||
                            row.code ||
                            "this item";

                          if (
                            window.confirm(
                              `Are you sure you want to delete ${itemName}`,
                            )
                          ) {
                            onDelete(row);
                          }
                        }}
                        size="small"
                        sx={{ bgcolor: "#fef2f2" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReusableTable;
