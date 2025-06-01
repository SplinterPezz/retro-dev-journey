package utils

import (
	"github.com/gin-gonic/gin"
)

type Response struct {
	Message string `json:"message"`
}

func RetriveTokenFromRequestHttp(c *gin.Context) *string {
	// Get the "Authorization" header from the request
	tokenString := c.Request.Header.Get("Authorization")

	// Check if the Authorization header is present
	if tokenString == "" {
		return nil
	}

	// Check if the token string is long enough to contain "Bearer " and the token
	if len(tokenString) < 7 || tokenString[:7] != "Bearer " {
		return nil
	}

	// Slice the token string to remove the "Bearer " part and return the token
	token := tokenString[7:]
	return &token
}
