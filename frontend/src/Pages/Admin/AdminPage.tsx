import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import './AdminPage.css';
import { StyledTextField, blackCalendarTheme, apexUniqueUsers, apexDailyAvarage, apexInteractionsDaily, apexDailyDownloads, apexBrowsersPie, apexDevicesDonut } from './AdminChart';
import {
  getDailyUniqueUsers,
  getPageTimeStats,
  getDownloadStats,
  getInteractionStats,
  getDeviceStats,
  getBrowserStats
} from '../../Services/analyticsService';

import { DailyUsersResponse } from '../../types/analytics';

export default function AdminPage() {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(30, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [uniqueUsers, setUniqueUsers] = useState(false);
  const [pageTime, setPageTime] = useState(false);
  const [interactions, setInteractions] = useState(false);
  const [downloads, setDownloads] = useState(false);
  const [devices, setDevices] = useState(false);
  const [browsers, setBrowsers] = useState(false);


  const [chartUniqueUsers, setChartUniqueUsers] = useState(apexUniqueUsers);
  const [chartPageTime, setChartPageTime] = useState(apexDailyAvarage);
  const [chartInteractions, setChartInteractions] = useState(apexInteractionsDaily);
  const [chartDownloads, setChartDownloads] = useState(apexDailyDownloads);
  const [chartDevices, setChartDevices] = useState(apexDevicesDonut);
  const [chartBrowsers, setChartBrowsers] = useState(apexBrowsersPie);

  const fetchData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);

    try {
      const dateRange = {
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD')
      };

      // Fetch both datasets
      const [usersResponse, pageTimeResponse, interactionsResponse, downloadResponse, devicesResponse, browsersResponse] = await Promise.all([
        getDailyUniqueUsers(dateRange),
        getPageTimeStats(dateRange),
        getInteractionStats(dateRange),
        getDownloadStats(dateRange),
        getDeviceStats(dateRange),
        getBrowserStats(dateRange)
      ]);

      // Handle Daily Users Data
      if ('data' in usersResponse) {
        setUniqueUsers(true)

        const categories = usersResponse.data.map(item =>
          dayjs(item.date).format('MMM DD')
        );
        const seriesData = usersResponse.data.map(item => item.uniqueUsers);

        setChartUniqueUsers(prev => ({
          ...prev,
          series: [{
            name: "Unique Users",
            data: seriesData
          }],
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: categories
            }
          }
        }));
      }

      // Handle Page Time Data
      if ('data' in pageTimeResponse) {
        setPageTime(true)

        // Group data by page
        const pageGroups: { [page: string]: { date: string; averageTime: number }[] } = {};
        pageTimeResponse.data.forEach(item => {
          if (!pageGroups[item.page]) {
            pageGroups[item.page] = [];
          }
          pageGroups[item.page].push({
            date: item.date,
            averageTime: item.averageTime
          });
        });

        // Get all unique dates for x-axis
        const allDates = [...new Set(pageTimeResponse.data.map(item => item.date))].sort();
        const categories = allDates.map(date => dayjs(date).format('MMM DD'));

        // Create series for each page
        const series = Object.keys(pageGroups).map(page => {
          // Create data array matching all dates
          const data = allDates.map(date => {
            const entry = pageGroups[page].find(item => item.date === date);
            return entry ? entry.averageTime : 0;
          });

          return {
            name: page.charAt(0).toUpperCase() + page.slice(1), // Capitalize page name
            data: data
          };
        });

        setChartPageTime(prev => ({
          ...prev,
          series: series,
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: categories
            }
          }
        }));
      }

      if ('data' in interactionsResponse) {
        setInteractions(true);

        // Sort by count descending and take top 10 for better readability
        const sortedData = interactionsResponse.data
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        const categories = sortedData.map(item => {
          // Capitalize first letter and handle special cases
          if (item.info === '???') return 'Future Opportunity';
          return item.info.charAt(0).toUpperCase() + item.info.slice(1);
        });

        const seriesData = sortedData.map(item => item.count);

        setChartInteractions(prev => ({
          ...prev,
          series: [{
            name: "Interactions",
            data: seriesData
          }],
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: categories
            }
          }
        }));
      }

      if ('data' in downloadResponse) {
        setDownloads(true);

        // Group data by page
        const pageGroups: { [page: string]: { date: string; downloads: number }[] } = {};
        downloadResponse.data.forEach(item => {
          if (!pageGroups[item.page]) {
            pageGroups[item.page] = [];
          }
          pageGroups[item.page].push({
            date: item.date,
            downloads: item.downloads
          });
        });

        // Get all unique dates for x-axis
        const allDates = [...new Set(downloadResponse.data.map(item => item.date))].sort();
        const categories = allDates.map(date => dayjs(date).format('MMM DD'));

        // Create series for each page
        const series = Object.keys(pageGroups).map(page => {
          // Create data array matching all dates
          const data = allDates.map(date => {
            const entry = pageGroups[page].find(item => item.date === date);
            return entry ? entry.downloads : 0;
          });

          return {
            name: page.charAt(0).toUpperCase() + page.slice(1),
            data: data
          };
        });

        setChartDownloads(prev => ({
          ...prev,
          series: series,
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: categories
            }
          }
        }));
      }

      if ('data' in devicesResponse) {
        setDevices(true);

        const labels = devicesResponse.data.map(item =>
          item.device.charAt(0).toUpperCase() + item.device.slice(1)
        );

        const seriesData = devicesResponse.data.map(item => item.count);

        setChartDevices((prev: any) => ({
          ...prev,
          series: seriesData,
          options: {
            ...prev.options,
            labels: labels
          }
        }));
      }

      if ('data' in browsersResponse) {
        setBrowsers(true);

        const labels = browsersResponse.data.map(item =>
          item.browser.charAt(0).toUpperCase() + item.browser.slice(1)
        );

        const seriesData = browsersResponse.data.map(item => item.count);

        setChartBrowsers((prev: any) => ({
          ...prev,
          series: seriesData,
          options: {
            ...prev.options,
            labels: labels
          }
        }));
      }


      if ('error' in usersResponse || 'error' in pageTimeResponse) {
        setError('Failed to fetch some data');
      }

    } catch (err) {
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleDateChange = (newStartDate: Dayjs | null, newEndDate: Dayjs | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
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
                          className='date-picker start'
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

              {/* Loading/Error States */}
              {loading && (
                <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>
                  Loading chart data...
                </div>
              )}

              {error && (
                <div style={{ textAlign: 'center', color: '#ff6b6b', padding: '20px' }}>
                  Error: {error}
                </div>
              )}

              {/* Charts */}
              {!loading && !error && (
                <> 
                  {(browsers && devices ) && (
                  <div className="row mt-4">
                    {/* Devices Donut Chart */}
                    <div className="col-12 col-md-6 mb-4">
                      <div style={{
                        background: 'rgba(20, 20, 20, 0.6)',
                        borderRadius: '8px',
                        padding: '15px',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                        height: '100%'
                      }}>
                        <ReactApexChart 
                          options={chartDevices.options} 
                          series={chartDevices.series} 
                          type="donut" 
                          height={300}
                        />
                      </div>
                    </div>

                    {/* Browsers Pie Chart */}
                    <div className="col-12 col-md-6 mb-4">
                      <div style={{
                        background: 'rgba(20, 20, 20, 0.6)',
                        borderRadius: '8px',
                        padding: '15px',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                        height: '100%'
                      }}>
                        <ReactApexChart 
                          options={chartBrowsers.options} 
                          series={chartBrowsers.series} 
                          type="pie" 
                          width="100%"
                          height={300}
                        />
                      </div>
                    </div>
                  </div>
                  )}

                  {/* Daily Users Chart */}
                  {uniqueUsers && (
                    <div className="chart-container" style={{
                      background: 'rgb(43 34 30 / 16%)',
                      borderRadius: '8px',
                      padding: '10px',
                      paddingRight: '30px',
                    }}>
                      <ReactApexChart
                        options={chartUniqueUsers.options}
                        series={chartUniqueUsers.series}
                        type="line"
                        height={250}
                      />
                    </div>
                  )}

                  {/* Page Time Chart */}
                  {pageTime && (
                    <div className="chart-container mt-4" style={{
                      background: 'rgb(43 34 30 / 16%)',
                      borderRadius: '8px',
                      padding: '10px',
                      paddingRight: '30px',
                    }}>
                      <ReactApexChart
                        options={chartPageTime.options}
                        series={chartPageTime.series}
                        type="line"
                        height={250}
                      />
                    </div>
                  )}

                  {/* Interactions Chart */}
                  {interactions && (
                    <div className="chart-container mt-4" style={{
                      background: 'rgb(43 34 30 / 16%)',
                      borderRadius: '8px',
                      padding: '10px',
                      paddingRight: '15px',
                    }}>
                      <ReactApexChart
                        options={chartInteractions.options}
                        series={chartInteractions.series}

                        type="bar"
                        height={350}
                      />
                    </div>
                  )}


                  {/* Downloads Chart */}
                  {downloads && (
                    <div className="chart-container mt-4" style={{
                      background: 'rgb(43 34 30 / 16%)',
                      borderRadius: '8px',
                      padding: '10px',
                      paddingRight: '15px',
                    }}>
                      <ReactApexChart
                        options={chartDownloads.options}
                        series={chartDownloads.series}

                        type="line"
                        height={250}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}