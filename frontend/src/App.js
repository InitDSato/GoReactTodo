import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Container, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';

const columns = [
    { field: 'id', headerName: 'ID', width: 90, editable: false },
    { field: 'title', headerName: 'Title', width: 150, editable: true },
    { field: 'description', headerName: 'Description', width: 200, editable: true },
    {
        field: 'due_date',
        headerName: 'Due Date',
        type: 'date',
        width: 150,
        editable: true,
        valueGetter: (params) => dayjs(params.value).format('YYYY-MM-DD'),
    },
    {
        field: 'completed',
        headerName: 'Completed',
        type: 'boolean',
        width: 150,
        editable: true,
    },
    {
        field: 'created_at',
        headerName: 'Created At',
        type: 'dateTime',
        width: 200,
        valueGetter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
        field: 'updated_at',
        headerName: 'Updated At',
        type: 'dateTime',
        width: 200,
        valueGetter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
    },
];

function App() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const response = await axios.get('http://localhost:8080/todos');
        setTodos(response.data);
    };

    const addTodo = async () => {
        const newTodo = { title: title, description: description, due_date: dueDate, completed: false };
        await axios.post('http://localhost:8080/todos', newTodo);
        setTitle('');
        setDescription('');
        setDueDate('');
        fetchTodos();
        handleClose();
    };

    const handleCellEditCommit = async (params) => {
        const updatedTodo = { ...params.row, [params.field]: params.value };
        await axios.put(`http://localhost:8080/todos/${updatedTodo.id}`, updatedTodo);
        fetchTodos();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container>
            <h1>Todo List</h1>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Add Todo
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Todo</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Due Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addTodo} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={todos}
                    columns={columns}
                    pageSize={5}
                    onCellEditCommit={handleCellEditCommit}
                />
            </div>
        </Container>
    );
}

export default App;
