import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import { timeTrackingIntervals } from '../../types/tracking';

export const blackCalendarTheme = createTheme({
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

export const StyledTextField = styled(TextField)({
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

export const apexUniqueUsers = {
    series: [{
      name: "Unique Users",
      data: [] as number[]
    }],
    options: {
      chart: {
        height: 350,
        type: 'line' as const,
        zoom: {
          enabled: false
        },
        background: 'rgba(30, 30, 30, 0.7)',
        foreColor: '#ffffff',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth' as const,
        colors: ['#ffd700'],
        width: 3
      },
      title: {
        text: 'Daily Unique Users',
        align: 'left' as const,
        style: {
          color: '#ffd700',
          fontSize: '18px',
          fontWeight: 'bold',
          font: 'Arial',
        }
      },
      grid: {
        borderColor: '#333',
        strokeDashArray: 3,
        row: {
          colors: ['transparent'],
          opacity: 0.5
        },
      },
      xaxis: {
        categories: [] as string[],
        labels: {
          style: {
            colors: '#ffffff'
          }
        },
        axisBorder: {
          color: '#333'
        },
        axisTicks: {
          color: '#333'
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#ffffff'
          }
        }
      },
      tooltip: {
        theme: 'dark' as const,
        style: {
          fontSize: '12px',
          backgroundColor: '#000000'
        }
      },
      markers: {
        colors: ['#ffd700'],
        strokeColors: '#ffffff',
        strokeWidth: 2
      },
      colors: ['#ffd700'],
      legend: {
        labels: {
          colors: '#ffffff'
        }
      }
    } as ApexOptions,
  }


export const apexDailyAvarage = {
    series: [] as any[],
    options: {
      chart: {
        height: 350,
        type: 'line' as const,
        zoom: {
          enabled: false
        },
        background: 'rgba(30, 30, 30, 0.7)',
        foreColor: '#ffffff',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth' as const,
        width: 3
      },
      title: {
        text: 'Average Time per Page',
        align: 'left' as const,
        style: {
          color: '#ffd700',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      grid: {
        borderColor: '#333',
        strokeDashArray: 3,
        row: {
          colors: ['transparent'],
          opacity: 0.5
        },
      },
      xaxis: {
        categories: [] as string[],
        labels: {
          style: {
            colors: '#ffffff'
          }
        },
        axisBorder: {
          color: '#333'
        },
        axisTicks: {
          color: '#333'
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#ffffff'
          }
        },
        title: {
          text: 'Time (seconds - ' + timeTrackingIntervals[timeTrackingIntervals.length-1] +'s max)',
          style: {
            color: '#ffd700'
          }
        }
      },
      tooltip: {
        theme: 'dark' as const,
        style: {
          fontSize: '12px',
          backgroundColor: '#000000'
        }
      },
      legend: {
        labels: {
          colors: '#ffffff'
        }
      },
      colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#ffd700', '#96ceb4']
    } as ApexOptions,
  }

export const apexInteractionsDaily = {
  series: [{
    name: 'Interactions',
    data: [] as number[]
  }],
  options: {
    chart: {
      type: 'bar' as const,
      height: 350,
      background: 'rgba(30, 30, 30, 0.7)',
      foreColor: '#ffffff',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end' as const,
        colors: {
          ranges: [{
            from: 0,
            to: 1000,
            color: '#ffd700'
          }]
        }
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    title: {
      text: 'Most Interacted Elements',
      align: 'left' as const,
      margin: 20,
      style: {
        color: '#ffd700',
        fontSize: '18px',
        fontWeight: 'bold',
      }
    },
    xaxis: {
      categories: [] as string[],
      labels: {
        style: {
          colors: '#ffffff'
        },
        rotate: -45,
        rotateAlways: true
      },
      axisBorder: {
        color: '#333'
      },
      axisTicks: {
        color: '#333'
      }
    },
    yaxis: {
      title: {
        text: 'Number of Interactions',
        style: {
          color: '#ffd700'
        }
      },
      labels: {
        style: {
          colors: '#ffffff'
        }
      }
    },
    grid: {
      borderColor: '#333',
      strokeDashArray: 3,
      row: {
        colors: ['transparent'],
        opacity: 0.5
      },
    },
    fill: {
      opacity: 1,
      colors: ['#ffd700']
    },
    tooltip: {
      theme: 'dark' as const,
      style: {
        fontSize: '12px',
        backgroundColor: '#000000'
      },
      y: {
        formatter: function (val: number) {
          return val + " interactions"
        }
      }
    }
  } as ApexOptions,
}

export const apexDailyDownloads = {
  series: [] as any[],
  options: {
    chart: {
      height: 350,
      type: 'line' as const,
      zoom: {
        enabled: false
      },
      background: 'rgba(30, 30, 30, 0.7)',
      foreColor: '#ffffff',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth' as const,
      width: 3
    },
    title: {
      text: 'Daily Downloads by Page',
      align: 'left' as const,
      style: {
        color: '#ffd700',
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    grid: {
      borderColor: '#333',
      strokeDashArray: 3,
      row: {
        colors: ['transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      categories: [] as string[],
      labels: {
        style: {
          colors: '#ffffff'
        }
      },
      axisBorder: {
        color: '#333'
      },
      axisTicks: {
        color: '#333'
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff'
        }
      },
      title: {
        text: 'Number of Downloads',
        style: {
          color: '#ffd700'
        }
      }
    },
    tooltip: {
      theme: 'dark' as const,
      style: {
        fontSize: '12px',
        backgroundColor: '#000000'
      },
      y: {
        formatter: function (val: number) {
          return val + " downloads"
        }
      }
    },
    legend: {
      labels: {
        colors: '#ffffff'
      }
    },
    colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
  } as ApexOptions,
};

export const apexDevicesDonut = {
  series: [] as number[],
  options: {
    chart: {
      type: 'donut' as const,
      background: 'rgba(30, 30, 30, 0.7)',
      foreColor: '#ffffff'
    },
    title: {
      text: 'Users by Device Type',
      align: 'left' as const,
      style: {
        color: '#ffd700',
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    labels: [] as string[],
    colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
    legend: {
      labels: {
        colors: '#ffffff'
      },
      position: 'bottom' as const
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Users',
              color: '#ffd700',
              formatter: function (w: any) {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return total.toString();
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#ffffff']
      }
    },
    tooltip: {
      theme: 'dark' as const,
      style: {
        fontSize: '12px',
        backgroundColor: '#000000'
      },
      y: {
        formatter: function (val: number) {
          return val + " users"
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom' as const
        }
      }
    }]
  } as ApexOptions,
};

export const apexBrowsersPie = {
  series: [] as number[],
  options: {
    chart: {
      width: 380,
      type: 'pie' as const,
      background: 'rgba(30, 30, 30, 0.7)',
      foreColor: '#ffffff'
    },
    title: {
      text: 'Users by Browser',
      align: 'left' as const,
      style: {
        color: '#ffd700',
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    labels: [] as string[],
    colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
    legend: {
      labels: {
        colors: '#ffffff'
      },
      position: 'bottom' as const
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#ffffff']
      }
    },
    tooltip: {
      theme: 'dark' as const,
      style: {
        fontSize: '12px',
        backgroundColor: '#000000'
      },
      y: {
        formatter: function (val: number) {
          return val + " users"
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom' as const
        }
      }
    }]
  } as ApexOptions,
};
