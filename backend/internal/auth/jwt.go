package auth

import (
	"backend/internal/models"
	"backend/mongodb"
	"fmt"
	"time"

	"os"

	"github.com/golang-jwt/jwt/v5"
)

// Define a struct for the claims we want to include in the JWT
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// GenerateJWT creates a new JWT token for a user
func GenerateJWT(username string) (string, int64, error) {
	// Get the secret key from environment variable
	secretKey := os.Getenv("JWT_SECRET")
	if secretKey == "" {
		secretKey = "defaultsecret" // fallback if not set in .env
	}

	// Set token expiration time (e.g., 1 hour)
	expirationTime := time.Now().Add(24 * time.Hour)
	//expirationTime := time.Now().Add(30 * time.Second)

	// Create JWT claims
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			Issuer:    os.Getenv("APP_NAME"),
		},
	}

	// Create a new JWT token with the claims and secret key
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	signedToken, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", 0, fmt.Errorf("could not sign token: %v", err)
	}

	return signedToken, expirationTime.Unix(), nil
}

// ValidateJWT validates the JWT token and returns the claims if valid
func ValidateJWT(tokenString string) (*Claims, error) {
	secretKey := os.Getenv("JWT_SECRET")
	if secretKey == "" {
		secretKey = "defaultsecret" // fallback if not set in .env
	}

	// Parse and validate the token
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// Validate the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, fmt.Errorf("could not parse token: %v", err)
	}

	// Return the claims if the token is valid
	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}

func GetUserFromToken(tokenString string) (*models.User, error) {
	claims, err := ValidateJWT(tokenString)
	if err != nil {
		return nil, fmt.Errorf("could not validate token: %v", err)
	}

	user, err := mongodb.FindUserByUsername(claims.Username, true)
	if err != nil {
		return nil, fmt.Errorf("could not find user: %v", err)
	}

	return user, nil
}