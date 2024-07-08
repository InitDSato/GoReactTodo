import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Container, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';

const current_uri_obj = new URL(window.location.href);
const backend_uri = `${current_uri_obj.protocol}//${current_uri_obj.hostname}:8080`;

const columns = [
    {
        field: 'completed',
        headerName: '完了',
        type: 'boolean',
        width: 90,
        editable: true,
    },
    { field: 'id', headerName: 'ID', width: 90, editable: false },
    { field: 'title', headerName: 'タイトル', width: 150, editable: true },
    { field: 'description', headerName: '説明', width: 200, editable: true },
    {
        field: 'due_date',
        headerName: '期限',
        type: 'date',
        width: 150,
        editable: true,
        valueGetter: (param) => dayjs(param),
        valueFormatter: (param) => dayjs(param).format('YYYY-MM-DD'),
    },
    {
        field: 'created_at',
        headerName: '作成日時',
        type: 'dateTime',
        width: 200,
        valueGetter: (param) => dayjs(param),
        valueFormatter: (param) => dayjs(param).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
        field: 'updated_at',
        headerName: '更新日時',
        type: 'dateTime',
        width: 200,
        valueGetter: (param) => dayjs(param),
        valueFormatter: (param) => dayjs(param).format('YYYY-MM-DD HH:mm:ss'),
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
        const response = await axios.get(`${backend_uri}/todos`);
        const sortedData = response.data.sort((a, b) => dayjs(b.updated_at).diff(dayjs(a.updated_at)));
        console.log(sortedData);
        setTodos(sortedData);
    };

    // 新しいTodoを追加する関数
    const addTodo = async () => {
        const newTodo = { 
            title: title, 
            description: description, 
            due_date: new Date(dueDate), 
            completed: false 
        };

        console.log("Sending new Todo:", newTodo);

        try {
            await axios.post(`${backend_uri}/todos`, newTodo);
            setTitle('');
            setDescription('');
            setDueDate('');
            fetchTodos();
            handleClose();
        } catch (error) {
            console.error("There was an error creating the Todo:", error);
        }
    };

    // セル編集が確定したときに呼ばれる関数
    const processRowUpdate = async (updatedRow, oldRow) => {
        try {
            const response = await axios.put(`${backend_uri}/todos/${updatedRow.id}`, updatedRow);
            return response.data;
        } catch (error) {
            console.error("There was an error updating the Todo:", error);
            return oldRow;
        }
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
                    processRowUpdate={processRowUpdate}
                    components={{ Toolbar: GridToolbar }}
                />
            </div>
        </Container>
    );
}

export default App;
