package handlers

import (
	"backend/internal/models"
	"backend/mongodb"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Helper function to parse date range from query parameters
func parseDateRange(c *gin.Context) (models.DateRangeFilter, error) {
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	// Default to last 30 days if no dates provided
	if startDateStr == "" || endDateStr == "" {
		endDate := time.Now()
		startDate := endDate.AddDate(0, 0, -30)
		return models.DateRangeFilter{
			StartDate: startDate,
			EndDate:   endDate,
		}, nil
	}

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		return models.DateRangeFilter{}, err
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		return models.DateRangeFilter{}, err
	}

	// Ensure start date is not after end date
	if startDate.After(endDate) {
		startDate, endDate = endDate, startDate
	}

	return models.DateRangeFilter{
		StartDate: startDate,
		EndDate:   endDate,
	}, nil
}

// 1. Get daily unique users
// GET /analytics/daily-users?start_date=2025-01-01&end_date=2025-01-31
func GetDailyUniqueUsers(c *gin.Context) {
	dateFilter, err := parseDateRange(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid date format. Use YYYY-MM-DD",
		})
		return
	}

	stats, err := mongodb.GetDailyUniqueUsers(dateFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get daily unique users",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":       stats,
		"start_date": dateFilter.StartDate.Format("2006-01-02"),
		"end_date":   dateFilter.EndDate.Format("2006-01-02"),
		"total_days": len(stats),
	})
}

// 2. Get average time per page per day
// GET /analytics/page-time?start_date=2025-01-01&end_date=2025-01-31
func GetPageTimeStats(c *gin.Context) {
	dateFilter, err := parseDateRange(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid date format. Use YYYY-MM-DD",
		})
		return
	}

	stats, err := mongodb.GetAverageTimePerPage(dateFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get page time stats",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":          stats,
		"start_date":    dateFilter.StartDate.Format("2006-01-02"),
		"end_date":      dateFilter.EndDate.Format("2006-01-02"),
		"total_records": len(stats),
	})
}

// 3. Get daily downloads
// GET /analytics/downloads?start_date=2025-01-01&end_date=2025-01-31
func GetDownloadStats(c *gin.Context) {
	dateFilter, err := parseDateRange(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid date format. Use YYYY-MM-DD",
		})
		return
	}

	stats, err := mongodb.GetDailyDownloads(dateFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get download stats",
		})
		return
	}

	// Calculate total downloads
	totalDownloads := 0
	for _, stat := range stats {
		totalDownloads += stat.Downloads
	}

	c.JSON(http.StatusOK, gin.H{
		"data":            stats,
		"start_date":      dateFilter.StartDate.Format("2006-01-02"),
		"end_date":        dateFilter.EndDate.Format("2006-01-02"),
		"total_downloads": totalDownloads,
	})
}

// 4. Get interaction stats
// GET /analytics/interactions?start_date=2025-01-01&end_date=2025-01-31
func GetInteractionStats(c *gin.Context) {
	dateFilter, err := parseDateRange(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid date format. Use YYYY-MM-DD",
		})
		return
	}

	stats, err := mongodb.GetInteractionStats(dateFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get interaction stats",
		})
		return
	}

	// Calculate total interactions
	totalInteractions := 0
	for _, stat := range stats {
		totalInteractions += stat.Count
	}

	c.JSON(http.StatusOK, gin.H{
		"data":               stats,
		"start_date":         dateFilter.StartDate.Format("2006-01-02"),
		"end_date":           dateFilter.EndDate.Format("2006-01-02"),
		"total_interactions": totalInteractions,
	})
}

// 5. Get device usage stats
// GET /analytics/devices?start_date=2025-01-01&end_date=2025-01-31
func GetDeviceStats(c *gin.Context) {
	dateFilter, err := parseDateRange(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid date format. Use YYYY-MM-DD",
		})
		return
	}

	stats, err := mongodb.GetDeviceStats(dateFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get device stats",
		})
		return
	}

	// Calculate total unique users across devices
	totalUsers := 0
	for _, stat := range stats {
		totalUsers += stat.Count
	}

	c.JSON(http.StatusOK, gin.H{
		"data":        stats,
		"start_date":  dateFilter.StartDate.Format("2006-01-02"),
		"end_date":    dateFilter.EndDate.Format("2006-01-02"),
		"total_users": totalUsers,
	})
}

// 6. Get browser usage stats
// GET /analytics/browsers?start_date=2025-01-01&end_date=2025-01-31
func GetBrowserStats(c *gin.Context) {
	dateFilter, err := parseDateRange(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid date format. Use YYYY-MM-DD",
		})
		return
	}

	stats, err := mongodb.GetBrowserStats(dateFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get browser stats",
		})
		return
	}

	// Calculate total unique users across browsers
	totalUsers := 0
	for _, stat := range stats {
		totalUsers += stat.Count
	}

	c.JSON(http.StatusOK, gin.H{
		"data":        stats,
		"start_date":  dateFilter.StartDate.Format("2006-01-02"),
		"end_date":    dateFilter.EndDate.Format("2006-01-02"),
		"total_users": totalUsers,
	})
}
