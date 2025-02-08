import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Typography,
  Checkbox,
  Paper,
  Button,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import dayjs, { Dayjs } from 'dayjs';
import { Todo, UpdateTodo } from '../utils/db';

interface TodoListProps {
  todos: Todo[];
  selectedDate: Dayjs | null;
  onAddTodo: (title: string) => void;
  onUpdateTodo: (todo: UpdateTodo) => void;
  onDeleteTodo: (id: number) => void;
  onToggleComplete: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  selectedDate,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onToggleComplete,
}) => {
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<UpdateTodo | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAddTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const handleEdit = (todo: Todo) => {
    if (todo.id !== undefined) {
      setEditingTodo({
        id: todo.id,
        title: todo.title,
        completed: todo.completed || false,
        dueDate: todo.dueDate || null,
      });
    }
  };

  const handleUpdateTodo = () => {
    if (editingTodo && editingTodo.id !== undefined) {
      onUpdateTodo({
        id: editingTodo.id,
        title: editingTodo.title,
        completed: editingTodo.completed || false,
        dueDate: editingTodo.dueDate || null,
      });
      setEditingTodo(null);
    }
  };

  const handleDelete = (id: number | undefined) => {
    if (id !== undefined) {
      onDeleteTodo(id);
    }
  };

  const handleToggleComplete = (todo: Todo) => {
    onToggleComplete(todo);
  };

  return (
    <Box 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            px: 2,
            py: 2,
            borderBottom: 1,
            borderColor: 'divider',
            ...(isMobile && {
              position: 'sticky',
              top: 0,
              zIndex: 2,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              ...(theme.palette.mode === 'dark' && {
                backgroundColor: 'rgba(18, 18, 18, 0.8)',
              }),
            }),
          }}
        >
          <Box
            component="form"
            onSubmit={handleAddTodo}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="新しいタスクを入力"
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: 'none',
                    border: 1,
                    borderColor: 'divider',
                    pl: 2,
                    pr: 1,
                    py: 1,
                    fontSize: '1rem',
                    '&:hover, &.Mui-focused': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 0 1px rgba(25, 118, 210, 0.2)',
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={handleAddTodo}
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                        width: 32,
                        height: 32,
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>

        <List 
          sx={{ 
            flex: 1,
            overflowY: 'auto',
            py: 1,
            px: 2,
            gap: 1.5,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                p: 0,
                boxShadow: 'none',
                border: 1,
                borderColor: todo.completed ? 'divider' : 'primary.main',
                opacity: todo.completed ? 0.7 : 1,
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 4,
                  height: '100%',
                  bgcolor: todo.completed ? 'divider' : 'primary.main',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  px: 2,
                  py: 1.5,
                  pl: 3,
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  edge="start"
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 24,
                    },
                    mr: 1.5,
                    color: todo.completed ? 'text.disabled' : 'primary.main',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                />
                {editingTodo?.id === todo.id && editingTodo ? (
                  <TextField
                    fullWidth
                    value={editingTodo?.title || ''}
                    onChange={(e) => {
                      if (editingTodo && editingTodo.id !== undefined) {
                        const updatedTodo: UpdateTodo = {
                          id: editingTodo.id,
                          title: e.target.value,
                          completed: editingTodo.completed || false,
                          dueDate: editingTodo.dueDate || null,
                        };
                        setEditingTodo(updatedTodo);
                      }
                    }}
                    onBlur={handleUpdateTodo}
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdateTodo()}
                    size="small"
                    autoFocus
                    sx={{
                      '& .MuiInputBase-root': {
                        fontSize: '1rem',
                        bgcolor: 'background.paper',
                        '&::before, &::after': {
                          display: 'none',
                        },
                      },
                      '& .MuiInput-underline:before': {
                        borderBottom: 'none',
                      },
                    }}
                  />
                ) : (
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 500,
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'text.disabled' : 'text.primary',
                        mb: todo.dueDate ? 0.5 : 0,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {todo.title}
                    </Typography>
                    {todo.dueDate && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.8rem',
                          color: todo.completed ? 'text.disabled' : 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <CalendarTodayIcon sx={{ fontSize: '0.9rem' }} />
                        {dayjs(todo.dueDate).format('M月D日')}
                      </Typography>
                    )}
                  </Box>
                )}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    gap: 0.5, 
                    ml: 1,
                    opacity: 0.7,
                    '&:hover': {
                      opacity: 1,
                    },
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEdit(todo)}
                    size="small"
                    sx={{ 
                      color: 'text.secondary',
                      p: 1,
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => todo.id && handleDelete(todo.id)}
                    size="small"
                    sx={{ 
                      color: 'text.secondary',
                      p: 1,
                      '&:hover': {
                        color: 'error.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </ListItem>
          ))}
          {todos.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 2,
                opacity: 0.5,
                userSelect: 'none',
              }}
            >
              <AssignmentIcon sx={{ fontSize: '3rem' }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                タスクがありません
              </Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Box>
  );
};
