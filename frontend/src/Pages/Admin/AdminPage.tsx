import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import './AdminPage.css';
import {
  getDailyUniqueUsers,
  getPageTimeStats,
  getDownloadStats,
  getInteractionStats,
  getDeviceStats,
  getBrowserStats
} from '../../Services/analyticsService';

// Black themed calendar
const blackCalendarTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          color: '#ffffff',
          border: '2px solid #333',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: '#ffd700',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#e6c200',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#ffd700',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
        h4: {
          color: '#ffd700',
        },
        caption: {
          color: '#cccccc',
        },
        body2: {
          color: '#ffffff',
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffd700',
      contrastText: '#000000',
    },
    background: {
      paper: 'rgba(0, 0, 0, 0.95)',
      default: 'rgba(0, 0, 0, 0.95)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
  },
});

// Styled DatePicker for RPG theme - Black Edition
const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '4px',
    border: '2px solid #333',
    color: '#fff',
    '&:hover': {
      borderColor: '#ffd700',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    '&.Mui-focused': {
      borderColor: '#ffd700',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.6)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#ccc',
    fontWeight: 'bold',
    '&.Mui-focused': {
      color: '#ffd700',
    },
    '&.MuiInputLabel-shrunk': {
      color: '#ffd700',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: '#ffd700',
  },
});

export default function AdminPage() {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(30, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  console.log(startDate, endDate)

  const handleDateChange = (newStartDate: Dayjs | null, newEndDate: Dayjs | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    // Here you can trigger API calls when dates change
    if (newStartDate && newEndDate) {
      console.log('Date range changed:', {
        start_date: newStartDate.format('YYYY-MM-DD'),
        end_date: newEndDate.format('YYYY-MM-DD')
      });
    }
  };

  return (
    <div className="rpgui-content">
      <div className="admin-container">
        <div className="admin-background" />
        <div className="admin-content">
          {/* Header */}
          <div className="admin-header">
            <div className="admin-title-section">
              <h1 className="admin-title">Dashboard</h1>
            </div>
          </div>
          {/* Main content area */}
          <div className="admin-main-content">
            <div className="rpgui-container framed-golden main-dashboard">
              <div className="dashboard-header-content">
                <div className="dashboard-info">
                  <h2 className="dashboard-title">Analytics Overview</h2>
                  <p className="dashboard-description ms-2">
                    Portfolio performance and visitor insights
                  </p>
                </div>
                
                <div className="date-picker-section">
                  <ThemeProvider theme={blackCalendarTheme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div className="date-pickers-container">
                        <DatePicker  
                          className='date-picker me-3'
                          value={startDate}
                          onChange={(newValue) => handleDateChange(newValue, endDate)}
                          maxDate={dayjs()}
                          enableAccessibleFieldDOMStructure={false}
                          slots={{
                            textField: StyledTextField
                          }}
                        />
                        <DatePicker
                          value={endDate}
                          className='date-picker'
                          onChange={(newValue) => handleDateChange(startDate, newValue)}
                          maxDate={dayjs()}
                          minDate={startDate !== null ? startDate : dayjs()}
                          enableAccessibleFieldDOMStructure={false}
                          slots={{
                            textField: StyledTextField
                          }}
                        />
                      </div>
                    </LocalizationProvider>
                  </ThemeProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}