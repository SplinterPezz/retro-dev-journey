package auth

import (
	"backend/internal/models"
	"backend/internal/utils"
	"backend/mongodb"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

// Define a struct for the claims we want to include in the JWT
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func GetUserFromToken(tokenString string) (*models.User, error) {
	claims, err := utils.ValidateJWT(tokenString)
	if err != nil {
		return nil, fmt.Errorf("could not validate token: %v", err)
	}

	user, err := mongodb.FindUserByUsername(claims.Username, true)
	if err != nil {
		return nil, fmt.Errorf("could not find user: %v", err)
	}

	return user, nil
}