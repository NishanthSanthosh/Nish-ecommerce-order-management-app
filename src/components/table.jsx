import React, { useState, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";

const ReusableTable = ({ headers, data, accessors }) => {
  const [order, setOrder] = useState("asc"); // asc | desc
  const [orderBy, setOrderBy] = useState(accessors[0]); // default sort column
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Sorting logic
  const handleSort = (key) => {
    const isAsc = orderBy === key && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(key);
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const A = a[orderBy];
      const B = b[orderBy];

      if (typeof A === "string" && typeof B === "string") {
        return order === "asc" ? A.localeCompare(B) : B.localeCompare(A);
      }
      if (typeof A === "number" && typeof B === "number") {
        return order === "asc" ? A - B : B - A;
      }
      return 0;
    });
  }, [data, order, orderBy]);

  // Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () =>
      sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage],
  );

  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#e7f1f3" }}>
            <TableRow>
              {headers.map((header, i) => (
                <TableCell
                  key={i}
                  align={i === 0 ? "left" : "right"}
                  sortDirection={orderBy === accessors[i] ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === accessors[i]}
                    direction={orderBy === accessors[i] ? order : "asc"}
                    onClick={() => handleSort(accessors[i])}
                  >
                    {header}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {accessors.map((key, i) => (
                  <TableCell key={i} align={i === 0 ? "left" : "right"}>
                    {row[key] ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ReusableTable;
