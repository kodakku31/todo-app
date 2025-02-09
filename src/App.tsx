import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Box, Container, IconButton, useMediaQuery, Typography } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { TodoList } from './components/TodoList';
import type { Todo, NewTodo, UpdateTodo } from './utils/db';
import { addTodo, updateTodo, deleteTodo, getAllTodos } from './utils/db';
import dayjs, { Dayjs } from 'dayjs';
import './App.css';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    loadTodos();
    loadAllTodos();
  }, []);

  useEffect(() => {
    filterTodosByDate();
  }, [selectedDate, allTodos]);

  const loadTodos = async () => {
    try {
      const loadedTodos = await getAllTodos();
      const filteredTodos = selectedDate
        ? loadedTodos.filter(
            (todo) =>
              todo.dueDate &&
              dayjs(todo.dueDate).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD')
          )
        : loadedTodos;
      setTodos(filteredTodos);
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  };

  const loadAllTodos = async () => {
    try {
      const loadedTodos = await getAllTodos();
      setAllTodos(loadedTodos);
    } catch (error) {
      console.error('Failed to load all todos:', error);
    }
  };

  const filterTodosByDate = () => {
    if (!selectedDate || !allTodos) return;
    const filteredTodos = allTodos.filter(
      (todo) =>
        todo.dueDate &&
        dayjs(todo.dueDate).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD')
    );
    setTodos(filteredTodos);
  };

  const getTodosCountForDate = (date: Dayjs) => {
    return allTodos.filter(
      (todo) =>
        todo.dueDate &&
        dayjs(todo.dueDate).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    ).length;
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#90caf9' : '#1976d2',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                transition: 'background-color 0.3s ease-in-out',
              },
            },
          },
          MuiContainer: {
            styleOverrides: {
              root: {
                paddingTop: '2rem',
                paddingBottom: '2rem',
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleAddTodo = async (title: string) => {
    try {
      const todo: NewTodo = {
        title: title.trim(),
        completed: false,
        dueDate: selectedDate ? dayjs(selectedDate).format() : null,
      };
      await addTodo(todo);
      await loadAllTodos();
      await filterTodosByDate();
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleUpdateTodo = async (todo: UpdateTodo) => {
    try {
      await updateTodo(todo);
      await loadAllTodos();
      await filterTodosByDate();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      await loadAllTodos();
      await filterTodosByDate();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      if (todo.id !== undefined) {
        const updatedTodo: UpdateTodo = {
          ...todo,
          id: todo.id,
          completed: !todo.completed,
        };
        await updateTodo(updatedTodo);
        await loadAllTodos();
        await filterTodosByDate();
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            display: 'flex',
            placeItems: 'center',
            minWidth: '320px',
            justifyContent: 'center',
            width: '100%',
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              maxWidth: '800px !important',
              width: '100%',
              padding: '16px',
              margin: '0 auto',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  position: 'fixed',
                  top: isMobile ? 'env(safe-area-inset-top)' : 16,
                  right: isMobile ? 8 : 16,
                  zIndex: 1100
                }}
              >
                <IconButton
                  onClick={toggleColorMode}
                  color="inherit"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': {
                      bgcolor: 'background.paper',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  position: 'fixed',
                  top: isMobile ? 'env(safe-area-inset-top)' : 0,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  backdropFilter: 'blur(10px)',
                  backgroundColor: mode === 'dark' 
                    ? 'rgba(30, 30, 30, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '800px',
                    px: 2,
                    py: 1
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary'
                    }}
                  >
                    {showCalendar ? 'カレンダー' : 'タスク'}
                  </Typography>
                  <IconButton
                    onClick={() => setShowCalendar(!showCalendar)}
                    sx={{
                      color: 'text.primary'
                    }}
                  >
                    {showCalendar ? (
                      <Typography variant="body2">タスク</Typography>
                    ) : (
                      <Typography variant="body2">カレンダー</Typography>
                    )}
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  height: '100%',
                  marginTop: 'calc(48px + env(safe-area-inset-top))'
                }}
              >
                {!showCalendar ? (
                  <TodoList
                    selectedDate={selectedDate}
                    todos={todos}
                    onAddTodo={handleAddTodo}
                    onUpdateTodo={handleUpdateTodo}
                    onDeleteTodo={handleDeleteTodo}
                    onToggleComplete={handleToggleComplete}
                  />
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      p: 2,
                    }}
                  >
                    <StaticDatePicker
                      value={selectedDate}
                      onChange={(newValue) => {
                        setSelectedDate(newValue);
                        setShowCalendar(false);
                      }}
                      slots={{
                        day: (props: PickersDayProps<Dayjs>) => {
                          const todosCount = getTodosCountForDate(props.day);
                          return (
                            <Box
                              sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                              }}
                            >
                              <PickersDay {...props} />
                              {todosCount > 0 && (
                                <Typography
                                  sx={{
                                    position: 'absolute',
                                    bottom: -2,
                                    right: -2,
                                    fontSize: '0.7rem',
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    lineHeight: 1,
                                  }}
                                >
                                  {todosCount}
                                </Typography>
                              )}
                            </Box>
                          );
                        },
                      }}
                      slotProps={{
                        toolbar: { hidden: true },
                        day: {
                          sx: {
                            fontSize: '0.9rem',
                            width: 36,
                            height: 36,
                            '&.Mui-selected': {
                              backgroundColor: 'primary.main',
                            },
                          },
                        },
                      }}
                      sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        '& .MuiPickersDay-root': {
                          fontSize: '0.9rem',
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
