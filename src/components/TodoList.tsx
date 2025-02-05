import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { CalendarView } from './CalendarView';
import { getAllTodos, addTodo, updateTodo, deleteTodo } from '../utils/db';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: dayjs.Dayjs | null;
  priority: 'high' | 'medium' | 'low';
}

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(null);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getAllTodos();
        setTodos(loadedTodos);
      } catch (error) {
        console.error('Failed to load todos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: newTodoText.trim(),
        completed: false,
        dueDate: selectedDate || dueDate,
        priority,
      };

      try {
        await addTodo(newTodo);
        setTodos([...todos, newTodo]);
        setNewTodoText('');
        setDueDate(null);
        setPriority('medium');
        setSelectedDate(null);
      } catch (error) {
        console.error('Failed to add todo:', error);
      }
    }
  };

  const handleToggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      try {
        await updateTodo(updatedTodo);
        setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
      } catch (error) {
        console.error('Failed to update todo:', error);
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleStartEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = async (id: number) => {
    if (editText.trim()) {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        const updatedTodo = { ...todo, text: editText.trim() };
        try {
          await updateTodo(updatedTodo);
          setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
          setEditingId(null);
          setEditText('');
        } catch (error) {
          console.error('Failed to update todo:', error);
        }
      }
    }
  };

  const handleDateClick = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    setView('list');
  };

  const filteredTodos = selectedDate
    ? todos.filter(
        todo =>
          todo.dueDate &&
          todo.dueDate.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
      )
    : todos;

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Tabs
        value={view}
        onChange={(_, newValue) => setView(newValue)}
        sx={{ mb: 3 }}
        centered
      >
        <Tab label="リスト" value="list" />
        <Tab label="カレンダー" value="calendar" />
      </Tabs>

      {view === 'list' && (
        <>
          <Stack spacing={2} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="新しいタスク"
              value={newTodoText}
              onChange={e => setNewTodoText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAddTodo()}
            />
            <DatePicker
              label="期限"
              value={selectedDate || dueDate}
              onChange={newDate => (selectedDate ? setSelectedDate(newDate) : setDueDate(newDate))}
            />
            <FormControl fullWidth>
              <InputLabel>優先度</InputLabel>
              <Select
                value={priority}
                label="優先度"
                onChange={e => setPriority(e.target.value as 'high' | 'medium' | 'low')}
              >
                <MenuItem value="high">高</MenuItem>
                <MenuItem value="medium">中</MenuItem>
                <MenuItem value="low">低</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTodo}
              disabled={!newTodoText.trim()}
            >
              追加
            </Button>
          </Stack>

          <List>
            {filteredTodos.map(todo => (
              <ListItem
                key={todo.id}
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                />
                {editingId === todo.id ? (
                  <TextField
                    fullWidth
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSaveEdit(todo.id)}
                    onBlur={() => handleSaveEdit(todo.id)}
                    autoFocus
                  />
                ) : (
                  <ListItemText
                    primary={todo.text}
                    secondary={
                      <>
                        {todo.dueDate && `期限: ${todo.dueDate.format('YYYY/MM/DD')} | `}
                        優先度: {
                          todo.priority === 'high' ? '高' :
                          todo.priority === 'medium' ? '中' : '低'
                        }
                      </>
                    }
                    sx={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                    }}
                  />
                )}
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleStartEditing(todo)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {view === 'calendar' && (
        <CalendarView todos={todos} onDateClick={handleDateClick} />
      )}
    </Box>
  );
};
