import { Paper, useTheme, useMediaQuery } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

interface CalendarViewProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

export default function CalendarView({ selectedDate, onDateSelect }: CalendarViewProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 1, sm: 2 },
        borderRadius: 2,
        bgcolor: 'background.paper',
        transition: 'background-color 0.3s ease-in-out',
      }}
    >
      <DateCalendar
        value={selectedDate ? dayjs(selectedDate) : null}
        onChange={(newDate) => onDateSelect(newDate?.toDate() || null)}
        sx={{
          width: '100%',
          '& .MuiPickersCalendarHeader-root': {
            pl: { xs: 1, sm: 2 },
            pr: { xs: 1, sm: 2 },
          },
          '& .MuiDayCalendar-weekContainer': {
            justifyContent: 'space-around',
          },
          '& .MuiPickersDay-root': {
            fontSize: isMobile ? '0.8rem' : '1rem',
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40,
          },
        }}
      />
    </Paper>
  );
}
