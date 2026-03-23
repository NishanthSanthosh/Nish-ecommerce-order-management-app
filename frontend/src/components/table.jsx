import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
const ReusableTable = ({ headers, data, accessors, onEdit, onDelete }) => {
  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "black", color: "white" }}>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{ fontWeight: "500", color: "white" }}
                >
                  {header}
                </TableCell>
              ))}

              {(onEdit || onDelete) && (
                <TableCell sx={{ fontWeight: "500", color: "white" }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {accessors.map((key, colIndex) => (
                  <TableCell key={colIndex}>{row[key] ?? "-"}</TableCell>
                ))}

                {(onEdit || onDelete) && (
                  <TableCell>
                    {onEdit && (
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(row)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    )}

                    {onDelete && (
                      <IconButton
                        color="error"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete ${row.product}`,
                            )
                          ) {
                            onDelete(row);
                          }
                        }}
                        size="small"
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
