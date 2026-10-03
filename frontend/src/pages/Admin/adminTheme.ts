// MUI theme and text field of the date pickers on the dashboard.
import { styled, createTheme } from '@mui/material/styles';
import { TextField } from '@mui/material';

export const blackCalendarTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(28 14 7)',
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
            backgroundColor: 'rgba(255, 217, 0, 0.1)',
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

export const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    backgroundColor: 'rgb(56 42 35)',
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
