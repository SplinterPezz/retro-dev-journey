package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Claims struct for JWT
type JWTClaims struct {
	Username string `json:"username"`
	Site     string `json:"site"`
	jwt.RegisteredClaims
}

// GenerateJWT creates a new JWT token for a user, signed with the given
// tenant-specific secret and carrying the tenant id ("site") as a claim.
func GenerateJWT(username string, site string, secret string) (string, int64, error) {
	// Set token expiration time (e.g., 24 hours)
	expirationTime := time.Now().Add(24 * time.Hour)

	// Create JWT claims
	claims := &JWTClaims{
		Username: username,
		Site:     site,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	// Create a new JWT token with the claims and secret key
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	signedToken, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", 0, fmt.Errorf("could not sign token: %v", err)
	}

	return signedToken, expirationTime.Unix(), nil
}

// ValidateJWT validates the JWT token against the given tenant-specific
// secret and returns the claims if valid. Using a different secret per
// tenant means a token minted for one tenant cannot be validated against
// another, even if an attacker replays it with a different Origin header.
func ValidateJWT(tokenString string, secret string) (*JWTClaims, error) {
	// Parse and validate the token
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		// Validate the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("could not parse token: %v", err)
	}

	// Return the claims if the token is valid
	claims, ok := token.Claims.(*JWTClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}
