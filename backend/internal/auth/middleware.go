package auth

import (
	"fmt"
	"net/http"
	"strings"

	"backend/internal/tenant"
	"backend/internal/utils"

	"github.com/gin-gonic/gin"
)

// TenantContextKey is the gin.Context key holding the resolved *tenant.Config.
const TenantContextKey = "tenant"

// TenantMiddleware resolves which tenant a request belongs to, based on the
// browser's Origin header (the backend is reached at one hostname, but is
// called from N different frontend domains — one per tenant). It must run
// before CORS and before JWTMiddleware, since even public routes (login,
// tracking) need to know which tenant database to use.
func TenantMiddleware(c *gin.Context) {
	origin := c.GetHeader("Origin")
	if origin == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Missing Origin header"})
		c.Abort()
		return
	}

	cfg, ok := tenant.ByOrigin(origin)
	if !ok {
		c.JSON(http.StatusForbidden, gin.H{"message": "Unknown origin"})
		c.Abort()
		return
	}

	c.Set(TenantContextKey, cfg)
	c.Next()
}

// GetTenant reads the tenant resolved by TenantMiddleware out of the context.
func GetTenant(c *gin.Context) *tenant.Config {
	return c.MustGet(TenantContextKey).(*tenant.Config)
}

// JWTMiddleware checks the token for authentication
func JWTMiddleware(c *gin.Context) {
	if c.Request.Method == http.MethodOptions {
		c.Next()
		return
	}

	// Skip the routes that don't require authentication
	// login is public
	// download pdf is public
	// info is public (for tracking)
	if c.Request.URL.Path == "/login" || c.Request.URL.Path == "/cv/download" || c.Request.URL.Path == "/info" {
		c.Next()
		return
	}

	cfg := GetTenant(c)

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

	// Validate the token against this tenant's secret. A token minted for
	// another tenant will fail here even if somehow paired with this Origin.
	claims, err := utils.ValidateJWT(tokenString, cfg.JWTSecret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": fmt.Sprintf("Invalid token: %v", err)})
		c.Abort()
		return
	}

	if claims.Site != cfg.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Token does not belong to this site"})
		c.Abort()
		return
	}

	user, err := GetUserFromToken(cfg, tokenString)
	if user == nil || err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": fmt.Sprintf("Invalid token: %v", err)})
		c.Abort()
		return
	}

	c.Set("user", claims)
	c.Next()
}
