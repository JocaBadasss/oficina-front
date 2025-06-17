'use client';

import * as React from 'react';
import {
  DateCalendar,
  PickersDay,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';

interface CalendarPickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const CustomDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isWeekend',
})<{ isWeekend?: boolean }>(({ isWeekend }) => ({
  ...(isWeekend && {
    backgroundColor: 'hsl(var(--destructive) / 0.2)',
    borderRadius: '0.375rem',
  }),
}));

const DayRenderer = (props: PickersDayProps) => {
  const { day, ...other } = props;
  const isWeekend = [0, 6].includes(day.getDay());

  return (
    <CustomDay
      {...other}
      day={day}
      isWeekend={isWeekend}
    />
  );
};

export function CalendarPicker({ date, setDate }: CalendarPickerProps) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ptBR}
    >
      <Box
        sx={{
          '.MuiPickersCalendarHeader-root': {
            color: 'hsl(var(--foreground))',
          },
          '.MuiPickersDay-root': {
            color: 'hsl(var(--foreground))',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem', // text-[0.8rem]
            fontWeight: 400, // font-normal
            borderRadius: '0.375rem',
          },

          '.MuiPickersDay-root.Mui-disabled': {
            backgroundColor: 'hsl(var(--destructive)) !important',
            color: 'hsl(var(--foreground))',
            opacity: 0.5,
            borderRadius: '0.375rem',
          },

          '.Mui-selected': {
            backgroundColor: 'hsl(var(--primary)) !important',
            color: 'hsl(var(--primary-foreground)) !important',
          },

          '.MuiPickersDay-root:not(.Mui-disabled):hover': {
            border: '1px solid hsl(var(--primary))',
          },
          '.MuiPickersDay-root.MuiPickersDay-today': {
            backgroundColor: 'hsl(var(--accent)) !important',
            color: 'hsl(var(--accent-foreground)) !important',
            outline: 'none !important',
            boxShadow: 'none !important',
            border: 'none !important',
          },

          '.MuiDayCalendar-weekDayLabel': {
            fontSize: '0.75rem', // text-[0.8rem]
            fontWeight: 400, // font-normal
            width: '2.25rem', // w-9
            color: 'hsl(var(--muted-foreground))',
            textAlign: 'center',
          },
          '.MuiIconButton-root .MuiSvgIcon-root': {
            height: '1.75rem', // h-7
            width: '1.75rem', // w-7
            padding: 0, // p-0
            borderRadius: '0.375rem', // rounded-md
            backgroundColor: 'transparent',
            border: '1px solid hsl(var(--foreground))',
            color: 'hsl(var(--foreground))',
            opacity: 0.5,
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 1,
            },
          },
          '.MuiPickersDay-dayOutsideMonth': {
            opacity: 0.4, // ou o valor que quiser
            color: 'hsl(var(--muted-foreground))', // opcional
          },
        }}
        className='max-w-sm flex justify-center self-center w-full rounded-md shadow-md bg-background border border-border p-2'
      >
        <DateCalendar
          value={date ?? null}
          onChange={(newDate) => setDate(newDate ?? undefined)}
          shouldDisableDate={(day) => [0, 6].includes(day.getDay())}
          slots={{ day: DayRenderer }}
          showDaysOutsideCurrentMonth
        />
      </Box>
    </LocalizationProvider>
  );
}
