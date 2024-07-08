import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Container, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';

const columns = [
    { field: 'id', headerName: 'ID', width: 90, editable: false },
    { field: 'title', headerName: 'タイトル', width: 150, editable: true },
    { field: 'description', headerName: '説明', width: 200, editable: true },
    {
        field: 'due_date',
        headerName: '期限',
        type: 'date',
        width: 150,
        editable: true,
        valueGetter: (params) => dayjs(params.value).format('YYYY-MM-DD'),
    },
    {
        field: 'completed',
        headerName: '完了',
        type: 'boolean',
        width: 150,
        editable: true,
    },
    {
        field: 'created_at',
        headerName: '作成日時',
        type: 'dateTime',
        width: 200,
        valueGetter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
        field: 'updated_at',
        headerName: '更新日時',
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

    // Todoリストを取得する関数
    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const response = await axios.get('http://localhost:8080/todos');
        setTodos(response.data);
    };

    // 新しいTodoを追加する関数
    const addTodo = async () => {
        const newTodo = { title: title, description: description, due_date: dueDate, completed: false };
        await axios.post('http://localhost:8080/todos', newTodo);
        setTitle('');
        setDescription('');
        setDueDate('');
        fetchTodos();
        handleClose();
    };

    // セル編集が確定したときに呼ばれる関数
    const handleCellEditCommit = async (params) => {
        const updatedTodo = { ...params.row, [params.field]: params.value };
        await axios.put(`http://localhost:8080/todos/${updatedTodo.id}`, updatedTodo);
        fetchTodos();
    };

    // ダイアログを開く関数
    const handleClickOpen = () => {
        setOpen(true);
    };

    // ダイアログを閉じる関数
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container>
            <h1>Todoリスト</h1>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Todoを追加
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Todoを追加</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="タイトル"
                        type="text"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="説明"
                        type="text"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="期限"
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
                        キャンセル
                    </Button>
                    <Button onClick={addTodo} color="primary">
                        追加
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
