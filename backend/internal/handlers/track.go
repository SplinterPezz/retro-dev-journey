package handlers

import (
	"backend/internal/auth"
	"backend/internal/models"
	"backend/mongodb"
	"net/http"

	"github.com/gin-gonic/gin"
)

func TrackData(c *gin.Context) {
	cfg := auth.GetTenant(c)
	db, ok := mongodb.GetTenantDB(cfg.ID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unknown tenant"})
		return
	}

	var trackData models.TrackData
	if err := c.ShouldBindJSON(&trackData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input for tracking Data"})
		return
	}

	if trackData.UUID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "UUID is required"})
		return
	}

	mongodb.SaveTrackData(db, trackData)
}
