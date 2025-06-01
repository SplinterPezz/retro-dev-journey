package auth

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// JWTMiddleware checks the token for authentication
func JWTMiddleware(c *gin.Context) {
	if c.Request.Method == http.MethodOptions {
		c.Next()
		return
	}
	// Skip the routes that don't require authentication
	// WS Route have a custom auth token checker
	// login and registration are public
	if c.Request.URL.Path == "/login" || c.Request.URL.Path == "/register" || c.Request.URL.Path == "/ws" {
		c.Next()
		return
	}

	// Extract the token from the Authorization header
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Missing token"})
		c.Abort()
		return
	}

	// Bearer token extraction
	if !strings.HasPrefix(tokenString, "Bearer ") {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid token format"})
		c.Abort()
		return
	}

	// Remove "Bearer " prefix and validate the token
	tokenString = tokenString[7:]

	// Validate the token
	claims, err := ValidateJWT(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": fmt.Sprintf("Invalid token: %v", err)})
		c.Abort()
		return
	}

	user, err := GetUserFromToken(tokenString)
	if user == nil || err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": fmt.Sprintf("Invalid token: %v", err)})
		c.Abort()
		return
	}

	c.Set("user", claims)
	c.Next()
}
