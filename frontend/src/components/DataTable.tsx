import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

const DataTable = <T extends { _id?: string }>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) => (
  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4 }}>
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.key as string}>
              <Typography variant="subtitle2" color="text.secondary">
                {column.label}
              </Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row._id || JSON.stringify(row)} hover>
            {columns.map((column) => (
              <TableCell key={column.key as string}>
                {column.render ? column.render(row) : (row as any)[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default DataTable;
