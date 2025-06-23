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
import { downloadCV, uploadCV } from '../../Services/fileService';
import { DailyUsersResponse } from '../../types/analytics';

type UploadStatus = 'success' | 'error' | 'waiting' | 'idle';

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

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');

  const fetchData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);

    try {
      const dateRange = {
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD')
      };

      const [usersResponse, pageTimeResponse, interactionsResponse, downloadResponse, devicesResponse, browsersResponse] = await Promise.all([
        getDailyUniqueUsers(dateRange),
        getPageTimeStats(dateRange),
        getInteractionStats(dateRange),
        getDownloadStats(dateRange),
        getDeviceStats(dateRange),
        getBrowserStats(dateRange)
      ]);

      if ('data' in usersResponse && usersResponse.data !== null) {
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

      if ('data' in pageTimeResponse && pageTimeResponse.data !== null) {
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
            name: page.charAt(0).toUpperCase() + page.slice(1),
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

      if ('data' in interactionsResponse && interactionsResponse.data !== null) {
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

      if ('data' in downloadResponse && downloadResponse.data !== null) {
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

      if ('data' in devicesResponse && devicesResponse.data !== null) {
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

      if ('data' in browsersResponse && browsersResponse.data !== null) {
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


      if ('error' in usersResponse || 'error' in pageTimeResponse || 'error' in browsersResponse || 'error' in devicesResponse || 'error' in interactionsResponse || 'error' in downloadResponse) {
        setError('Failed to fetch some data');
      }

    } catch (err) {
      setError('An error occurred while fetching data');
      process.env.REACT_APP_ENV === 'development' && console.log("Error: on fetch: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCV = () => {
      try {
        downloadCV();
      }
      catch(error){
        process.env.REACT_APP_ENV === 'development' && console.error('Download failed:', error);
      }
  };

  const handleUploadCV = async (file: File) => {
    setUploadStatus('waiting');
    
    try {
      const response = await uploadCV(file);
      if ('message' in response) {
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      setUploadStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      handleUploadCV(file);
    }
  };

  const getUploadColor = (): string => {
    if(uploadStatus === 'error') return 'red';
    if(uploadStatus === 'idle') return 'white';
    if(uploadStatus === 'success') return 'green';
    return 'gray';
  }

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
                  {(browsers && devices) && (
                    <div className="chart-container row pb-0 m-2 mt-4 mb-4">
                      {/* Devices Donut Chart */}
                      <div className="col-12 col-md-6 mb-4">
                        <div>
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
                        <div>
                          <ReactApexChart
                            options={chartBrowsers.options}
                            series={chartBrowsers.series}
                            type="pie"
                            height={300}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Daily Users Chart */}
                  {uniqueUsers && (
                    <div className="chart-container mt-4 m-2">
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
                    <div className="chart-container mt-4 m-2">
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
                    <div className="chart-container mt-4 m-2">
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
                    <div className="chart-container mt-4 m-2">
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
              <div className="row mt-4 chart-container m-2">
                    <div className='col-12 col-lg-6 dashboard-title' style={{alignContent:"center"}}>
                      UPDATE CV:
                    </div>
                    <div className='col-12 col-lg-3 mb-3 mt-3'>
                      <button
                        className="rpgui-button"
                        style={{width:"240px", height:"75px"}}
                        type="button"
                        onClick={x=> handleDownloadCV()}
                      >
                        <p className='revert-top'>DOWNLOAD</p>
                      </button>
                    </div>
                    <div className='col-12 col-lg-3 mb-3 mt-3'>
                      <input
                        type="file"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        id="cv-upload-input"
                        onChange={handleFileSelection}
                      />
                      <button
                        className="rpgui-button golden"
                        style={{width:"240px", height:"75px"}}
                        type="button"
                        onClick={() => document.getElementById('cv-upload-input')?.click()}
                        disabled = {uploadStatus === ('waiting') ? true : false}
                      >
                        <p className='revert-top' 
                          style={{
                            marginTop:"20px",
                            color: getUploadColor()
                          }}>
                          UPLOAD
                        </p>
                      </button>
                    </div>
                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}