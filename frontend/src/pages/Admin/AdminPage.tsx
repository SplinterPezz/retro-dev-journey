import React, { useState, useEffect, useMemo, useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import './AdminPage.css';
import { StyledTextField, blackCalendarTheme } from './adminTheme';
import {
  apexUniqueUsers,
  apexPageTime,
  apexInteractionsDaily,
  apexDailyDownloads,
  apexBrowsersPie,
  apexDevicesDonut,
} from './chartOptions';
import {
  getDailyUniqueUsers,
  getPageTimeStats,
  getDownloadStats,
  getInteractionStats,
  getDeviceStats,
  getBrowserStats,
} from '../../services/analyticsService';
import { isApiError } from '../../services/api';
import { downloadCV, uploadCV } from '../../services/fileService';
import { analyticsBackgroundImage, maxSizeFileCV } from '../../config/admin';
import { devError } from '../../config/env';
import { capitalize, dayLabel, toSeriesByPage } from './series';
import {
  BrowserStats,
  DailyUserStats,
  DeviceStats,
  DownloadStats,
  InteractionStats,
  PageTimeStats,
} from '../../types/analytics';

type UploadStatus = 'success' | 'error' | 'waiting' | 'idle';

interface AnalyticsData {
  users: DailyUserStats[] | null;
  pageTime: PageTimeStats[] | null;
  interactions: InteractionStats[] | null;
  downloads: DownloadStats[] | null;
  devices: DeviceStats[] | null;
  browsers: BrowserStats[] | null;
}

const NO_DATA: AnalyticsData = {
  users: null,
  pageTime: null,
  interactions: null,
  downloads: null,
  devices: null,
  browsers: null,
};

const withCategories = <C extends { options: { xaxis?: object } }>(chart: C, categories: string[]) => ({
  ...chart.options,
  xaxis: { ...chart.options.xaxis, categories },
});

export default function AdminPage() {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(30, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData>(NO_DATA);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!startDate || !endDate) return;
    let cancelled = false;
    const dateRange = { start_date: startDate.format('YYYY-MM-DD'), end_date: endDate.format('YYYY-MM-DD') };

    setLoading(true);
    setError(null);
    Promise.all([
      getDailyUniqueUsers(dateRange),
      getPageTimeStats(dateRange),
      getInteractionStats(dateRange),
      getDownloadStats(dateRange),
      getDeviceStats(dateRange),
      getBrowserStats(dateRange),
    ])
      .then(([users, pageTime, interactions, downloads, devices, browsers]) => {
        if (cancelled) return;
        const rows = <T,>(r: { data: T[] | null } | { success: boolean }): T[] | null =>
          isApiError(r) || !('data' in r) ? null : r.data;
        setData({
          users: rows(users),
          pageTime: rows(pageTime),
          interactions: rows(interactions),
          downloads: rows(downloads),
          devices: rows(devices),
          browsers: rows(browsers),
        });
        if ([users, pageTime, interactions, downloads, devices, browsers].some(isApiError)) {
          setError('Failed to fetch some data');
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError('An error occurred while fetching data');
        devError('Error on fetch:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [startDate, endDate]);

  const charts = useMemo(() => {
    const usersChart = data.users && {
      series: [{ name: 'Unique Users', data: data.users.map((d) => d.uniqueUsers) }],
      options: withCategories(apexUniqueUsers, data.users.map((d) => dayLabel(d.date))),
    };

    const pageTimeSeries = data.pageTime && toSeriesByPage(data.pageTime, (r) => r.averageTime);
    const pageTimeChart = pageTimeSeries && {
      series: pageTimeSeries.series,
      options: withCategories(apexPageTime, pageTimeSeries.categories),
    };

    // Top 10 by count, for readability.
    const topInteractions = data.interactions && [...data.interactions].sort((a, b) => b.count - a.count).slice(0, 10);
    const interactionsChart = topInteractions && {
      series: [{ name: 'Interactions', data: topInteractions.map((i) => i.count) }],
      options: withCategories(
        apexInteractionsDaily,
        topInteractions.map((i) => (i.info === '???' ? 'Future Opportunity' : capitalize(i.info)))
      ),
    };

    const downloadsSeries = data.downloads && toSeriesByPage(data.downloads, (r) => r.downloads);
    const downloadsChart = downloadsSeries && {
      series: downloadsSeries.series,
      options: withCategories(apexDailyDownloads, downloadsSeries.categories),
    };

    const devicesChart = data.devices && {
      series: data.devices.map((d) => d.count),
      options: { ...apexDevicesDonut.options, labels: data.devices.map((d) => capitalize(d.device)) },
    };

    const browsersChart = data.browsers && {
      series: data.browsers.map((b) => b.count),
      options: { ...apexBrowsersPie.options, labels: data.browsers.map((b) => capitalize(b.browser)) },
    };

    return { usersChart, pageTimeChart, interactionsChart, downloadsChart, devicesChart, browsersChart };
  }, [data]);

  const handleDownloadCV = async () => {
    try {
      await downloadCV();
    } catch (err) {
      devError('Download failed:', err);
    }
  };

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    input.value = ''; // picking the same file again must fire onChange again
    if (!file) return;

    if (file.size > maxSizeFileCV * 1024 * 1024) {
      setUploadStatus('error');
      setUploadMessage(`File size must be less than ${maxSizeFileCV}MB`);
      return;
    }

    setUploadStatus('waiting');
    setUploadMessage(null);
    const response = await uploadCV(file);
    if ('message' in response) {
      setUploadStatus('success');
    } else {
      setUploadStatus('error');
      setUploadMessage(response.error ?? 'Upload failed');
    }
  };

  const uploadColor = { error: 'red', idle: 'white', success: 'green', waiting: 'gray' }[uploadStatus];
  const { usersChart, pageTimeChart, interactionsChart, downloadsChart, devicesChart, browsersChart } = charts;

  return (
    <div className="rpgui-content">
      <div className="admin-container">
        <div className="admin-background" style={{ backgroundImage: `url(${analyticsBackgroundImage})` }} />
        <div className="admin-content">
          <div className="admin-header">
            <div className="admin-title-section">
              <h1 className="admin-title">Dashboard</h1>
            </div>
          </div>
          <div className="admin-main-content">
            <div className="rpgui-container framed-golden main-dashboard">
              <div className="dashboard-header-content">
                <div className="dashboard-info">
                  <h2 className="dashboard-title">Analytics Overview</h2>
                  <p className="dashboard-description ms-2">Portfolio performance and visitor insights</p>
                </div>

                <div className="date-picker-section">
                  <ThemeProvider theme={blackCalendarTheme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div className="date-pickers-container">
                        <DatePicker
                          className="date-picker start"
                          value={startDate}
                          onChange={setStartDate}
                          maxDate={dayjs()}
                          enableAccessibleFieldDOMStructure={false}
                          slots={{ textField: StyledTextField }}
                        />
                        <DatePicker
                          value={endDate}
                          className="date-picker"
                          onChange={setEndDate}
                          maxDate={dayjs()}
                          minDate={startDate ?? dayjs()}
                          enableAccessibleFieldDOMStructure={false}
                          slots={{ textField: StyledTextField }}
                        />
                      </div>
                    </LocalizationProvider>
                  </ThemeProvider>
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>Loading chart data...</div>
              )}

              {error && <div style={{ textAlign: 'center', color: '#ff6b6b', padding: '20px' }}>Error: {error}</div>}

              {!loading && !error && (
                <>
                  {browsersChart && devicesChart && (
                    <div className="chart-container row pb-0 m-2 mt-4 mb-4">
                      <div className="col-12 col-md-6 mb-4">
                        <ReactApexChart options={devicesChart.options} series={devicesChart.series} type="donut" height={300} />
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <ReactApexChart options={browsersChart.options} series={browsersChart.series} type="pie" height={300} />
                      </div>
                    </div>
                  )}

                  {usersChart && (
                    <div className="chart-container mt-4 m-2">
                      <ReactApexChart options={usersChart.options} series={usersChart.series} type="line" height={250} />
                    </div>
                  )}

                  {pageTimeChart && (
                    <div className="chart-container mt-4 m-2">
                      <ReactApexChart options={pageTimeChart.options} series={pageTimeChart.series} type="line" height={250} />
                    </div>
                  )}

                  {interactionsChart && (
                    <div className="chart-container mt-4 m-2">
                      <ReactApexChart options={interactionsChart.options} series={interactionsChart.series} type="bar" height={350} />
                    </div>
                  )}

                  {downloadsChart && (
                    <div className="chart-container mt-4 m-2">
                      <ReactApexChart options={downloadsChart.options} series={downloadsChart.series} type="line" height={250} />
                    </div>
                  )}
                </>
              )}
              <div className="row mt-4 chart-container m-2">
                <div className="col-12 col-lg-6 dashboard-title" style={{ alignContent: 'center' }}>
                  UPDATE CV:
                  {uploadMessage && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', margin: 0 }}>{uploadMessage}</p>}
                </div>
                <div className="col-12 col-lg-3 mb-3 mt-3">
                  <button className="rpgui-button" style={{ width: '240px', height: '75px' }} type="button" onClick={handleDownloadCV}>
                    <p className="revert-top">DOWNLOAD</p>
                  </button>
                </div>
                <div className="col-12 col-lg-3 mb-3 mt-3">
                  <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileSelection} />
                  <button
                    className="rpgui-button golden"
                    style={{ width: '240px', height: '75px' }}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadStatus === 'waiting'}
                  >
                    <p className="revert-top" style={{ marginTop: '20px', color: uploadColor }}>
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
