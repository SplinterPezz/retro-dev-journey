import { ApexOptions } from 'apexcharts';
import { timeTrackingIntervals } from '../../types/tracking';

export const apexUniqueUsers = {
    series: [{
      name: "Unique Users",
      data: [] as number[]
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
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
        curve: 'smooth',
        colors: ['#ffd700'],
        width: 3
      },
      title: {
        text: 'Daily Unique Users',
        align: 'left',
        style: {
          color: '#ffd700',
          fontSize: '18px',
          fontWeight: 'bold',
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
        theme: 'dark',
        style: {
          fontSize: '12px',
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
    } satisfies ApexOptions,
  }

export const apexPageTime = {
    series: [] as { name: string; data: number[] }[],
    options: {
      chart: {
        height: 350,
        type: 'line',
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
        curve: 'smooth',
        width: 3
      },
      title: {
        text: 'Average Time per Page',
        align: 'left',
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
          text: `Time (seconds - ${timeTrackingIntervals.at(-1) ?? 0}s max)`,
          style: {
            color: '#ffd700'
          }
        }
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '12px',
        }
      },
      legend: {
        labels: {
          colors: '#ffffff'
        }
      },
      colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#ffd700', '#96ceb4']
    } satisfies ApexOptions,
  }

export const apexInteractionsDaily = {
  series: [{
    name: 'Interactions',
    data: [] as number[]
  }],
  options: {
    chart: {
      type: 'bar',
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
        borderRadiusApplication: 'end',
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
      align: 'left',
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
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return `${val} interactions`
        }
      }
    }
  } satisfies ApexOptions,
}

export const apexDailyDownloads = {
  series: [] as { name: string; data: number[] }[],
  options: {
    chart: {
      height: 350,
      type: 'line',
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
      curve: 'smooth',
      width: 3
    },
    title: {
      text: 'Daily Downloads by Page',
      align: 'left',
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
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return `${val} downloads`
        }
      }
    },
    legend: {
      labels: {
        colors: '#ffffff'
      }
    },
    colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
  } satisfies ApexOptions,
};

export const apexDevicesDonut = {
  series: [] as number[],
  options: {
    chart: {
      type: 'donut',
      background: 'rgba(30, 30, 30, 0.7)',
      foreColor: '#ffffff'
    },
    title: {
      text: 'Users by Device Type',
      align: 'left',
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
      position: 'bottom'
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
              formatter: function (w: { globals: { seriesTotals: number[] } }) {
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
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return `${val} users`
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
          position: 'bottom'
        }
      }
    }]
  } satisfies ApexOptions,
};

export const apexBrowsersPie = {
  series: [] as number[],
  options: {
    chart: {
      width: 380,
      type: 'pie',
      background: 'rgba(30, 30, 30, 0.7)',
      foreColor: '#ffffff'
    },
    title: {
      text: 'Users by Browser',
      align: 'left',
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
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#ffffff']
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return `${val} users`
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
          position: 'bottom'
        }
      }
    }]
  } satisfies ApexOptions,
};
