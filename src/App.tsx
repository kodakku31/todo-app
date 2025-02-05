import { CssBaseline, Container, Typography, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TodoList } from './components/TodoList';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <Container>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            ToDoリスト
          </Typography>
          <TodoList />
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default App;
