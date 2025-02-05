import { useState } from 'react';
import { Box, IconButton, Typography, Badge } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

interface CalendarViewProps {
  todos: Array<{
    id: number;
    text: string;
    completed: boolean;
    dueDate: dayjs.Dayjs | null;
    priority: 'high' | 'medium' | 'low';
  }>;
  onDateClick: (date: dayjs.Dayjs) => void;
}

export const CalendarView = ({ todos, onDateClick }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const getDaysInMonth = (date: dayjs.Dayjs) => {
    const start = date.startOf('month').startOf('week');
    const end = date.endOf('month').endOf('week');
    const days = [];
    let day = start;

    while (day.isBefore(end)) {
      days.push(day);
      day = day.add(1, 'day');
    }

    return days;
  };

  const getTodosForDate = (date: dayjs.Dayjs) => {
    return todos.filter(
      todo =>
        todo.dueDate &&
        todo.dueDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  };

  const renderHeader = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <IconButton onClick={() => setCurrentMonth(prev => prev.subtract(1, 'month'))}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6">
          {currentMonth.format('YYYY年 M月')}
        </Typography>
        <IconButton onClick={() => setCurrentMonth(prev => prev.add(1, 'month'))}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    );
  };

  const renderDays = () => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
          mb: 1,
        }}
      >
        {days.map(day => (
          <Typography
            key={day}
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: day === '日' ? 'error.main' : day === '土' ? 'primary.main' : 'inherit',
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>
    );
  };

  const renderCells = () => {
    const days = getDaysInMonth(currentMonth);
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
        }}
      >
        {days.map(day => {
          const todosForDay = getTodosForDate(day);
          const isToday = day.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
          const isCurrentMonth = day.month() === currentMonth.month();

          return (
            <Box
              key={day.format('YYYY-MM-DD')}
              onClick={() => onDateClick(day)}
              sx={{
                p: 1,
                border: 1,
                borderColor: isToday ? 'primary.main' : 'divider',
                borderRadius: 1,
                bgcolor: isCurrentMonth ? 'background.paper' : 'action.hover',
                cursor: 'pointer',
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Typography
                sx={{
                  color: !isCurrentMonth
                    ? 'text.disabled'
                    : day.day() === 0
                    ? 'error.main'
                    : day.day() === 6
                    ? 'primary.main'
                    : 'inherit',
                }}
              >
                {day.format('D')}
              </Typography>
              {todosForDay.length > 0 && (
                <Badge
                  badgeContent={todosForDay.length}
                  color="primary"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </Box>
  );
};
