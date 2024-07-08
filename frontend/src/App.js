import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  TableSortLabel,
  Toolbar,
  Typography,
} from "@mui/material";

function App() {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/todos")
      .then(response => {
        setTodos(response.data);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTodos = filteredTodos.sort((a, b) => {
    if (orderBy === 'title') {
      return (order === 'asc' ? 1 : -1) * a.title.localeCompare(b.title);
    }
    return 0;
  });

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedTodos.length - page * rowsPerPage);

  return (
    <Container>
      <Toolbar>
        <Typography variant="h6" id="tableTitle" component="div">
          Todoリスト
        </Typography>
        <TextField
          label="検索"
          value={search}
          onChange={handleSearchChange}
          style={{ marginLeft: 'auto' }}
        />
      </Toolbar>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleRequestSort('title')}
                >
                  タイトル
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                完了
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTodos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(todo => (
              <TableRow key={todo.id}>
                <TableCell>{todo.title}</TableCell>
                <TableCell align="right">{todo.done ? "✔" : ""}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedTodos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
}

export default App;
