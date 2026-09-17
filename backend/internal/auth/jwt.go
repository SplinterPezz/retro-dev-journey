package auth

import (
	"backend/internal/models"
	"backend/internal/tenant"
	"backend/internal/utils"
	"backend/mongodb"
	"fmt"
)

// Define a struct for the claims we want to include in the JWT
type Claims struct {
	Username string `json:"username"`
	Site     string `json:"site"`
}

func GetUserFromToken(cfg *tenant.Config, tokenString string) (*models.User, error) {
	claims, err := utils.ValidateJWT(tokenString, cfg.JWTSecret)
	if err != nil {
		return nil, fmt.Errorf("could not validate token: %v", err)
	}

	db, ok := mongodb.GetTenantDB(cfg.ID)
	if !ok {
		return nil, fmt.Errorf("unknown tenant: %s", cfg.ID)
	}

	user, err := mongodb.FindUserByUsername(db, claims.Username, true)
	if err != nil {
		return nil, fmt.Errorf("could not find user: %v", err)
	}

	return user, nil
}
