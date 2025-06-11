package handlers

import (
	"backend/internal/models"
	"backend/mongodb"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func TrackData(c *gin.Context) {
	var trackData models.TrackData
	// Bind the incoming JSON request to the user struct
	if err := c.ShouldBindJSON(&trackData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input for tracking Data"})
		return
	}

	fmt.Println("Mapped data %v", trackData)

	if trackData.UUID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "UUID is required"})
		return
	}

	mongodb.SaveTrackData(trackData)
}
