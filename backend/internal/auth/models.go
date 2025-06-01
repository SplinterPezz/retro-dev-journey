package auth

import (
	"backend/internal/models"
	"backend/mongodb"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Register handles user registration by creating a new user
func Register(c *gin.Context) {
	var user models.User

	// Bind the incoming JSON request to the user struct
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	// Strip extra spaces from user fields
	stripUserFields(&user)

	// Validate the user's data
	if valid, fieldError, err := checkValidUser(&user); !valid {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error(), "fieldError": fieldError})
		return
	}

	// Check if the email or username is already registered
	if fieldError, err := checkIfUserExists(user.Email, user.Username); err != nil {
		c.JSON(http.StatusConflict, gin.H{"message": err.Error(), "fieldError": fieldError})
		return
	}

	// Hash the password before saving (ensure strong hash)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not hash password : " + err.Error()})
		return
	}
	user.Password = string(hashedPassword)
	userId, err := mongodb.CreateUser(user)

	// Create the user in the database
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create user : " + err.Error()})
		return
	}

	// Generate JWT token for the newly created user
	token, expiration, err := GenerateJWT(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create token : " + err.Error()})
		return
	}

	// Return the JWT token to the user
	c.JSON(http.StatusOK, gin.H{"token": token, "expiration": expiration, "id": userId, "user": user.Username})
}

func checkIfUserExists(email, username string) (string, error) {
	// Check if the email is already in use
	userEmail, err := mongodb.FindUserByEmailRegistration(email)
	if err == nil && userEmail != nil {
		return "email", fmt.Errorf("this email is already registered")
	}

	// Check if the username is already in use
	existingUser, err := mongodb.FindUserByUsername(username, false)
	if err == nil && existingUser != nil {
		return "username", fmt.Errorf("username already exists")
	}

	return "", nil
}

func checkValidUser(user *models.User) (bool, string, error) {
	if user == nil {
		return false, "", fmt.Errorf("user data is missing. Please try again")
	}
	if user.Email == "" {
		return false, "email", fmt.Errorf("email is required")
	}
	if user.Username == "" {
		return false, "username", fmt.Errorf("username is required")
	}
	if user.Password == "" {
		return false, "password", fmt.Errorf("password is required")
	}
	if !validateEmail(user.Email) {
		return false, "email", fmt.Errorf("invalid email format")
	}
	if !validatePassword(user.Password) {
		return false, "password", fmt.Errorf("password must be 8+ characters with uppercase, lowercase, number, and special character")
	}

	return true, "", nil
}

func validatePassword(password string) bool {
	var (
		hasMinLen  = false
		hasUpper   = false
		hasLower   = false
		hasNumber  = false
		hasSpecial = false
	)

	// Check the min lenght
	if len(password) >= 8 {
		hasMinLen = true
	}

	// Iterate in every char
	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsDigit(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	// Check all conditions
	return hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial
}

func validateEmail(email string) bool {
	// Simple regex for basic email validation
	// This regex checks for an email pattern like: username@domain.com
	var emailRegex = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

	// Compile the regex
	re := regexp.MustCompile(emailRegex)

	// Return true if the email matches the regex
	return re.MatchString(email)
}

func stripUserFields(user *models.User) {
	user.Email = strings.ToLower(stripSpaces(user.Email))
	user.Username = strings.ToLower(stripSpaces(user.Username))
	user.Password = stripSpaces(user.Password)
}

func stripSpaces(value string) string {
	return strings.TrimSpace(value)
}

// Login handles user login by verifying credentials and issuing JWT token
func Login(c *gin.Context) {
	var user models.User
	// Bind the incoming JSON request to the user struct
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	stripUserFields(&user)
	//Frontend should block these request
	if user.Email == "" && user.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Username or Email are required", "fieldError": "email"})
		return
	}

	//Frontend should block these request
	if user.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Password required", "fieldError": "password"})
		return
	}

	emailOrUsername := user.Username
	if emailOrUsername == "" {
		emailOrUsername = user.Email
	}

	// Find the user by username in the database
	storedUser, err := mongodb.FindUserByUsernameOrEmail(emailOrUsername)
	if err != nil || storedUser == nil {
		// If user is not found or any DB error occurs, return Unauthorized error
		c.JSON(http.StatusForbidden, gin.H{"message": "Invalid credentials", "fieldError": "unauthorized"})
		return
	}

	// Compare the stored hashed password with the provided password
	if err := bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password)); err != nil {
		// If password doesn't match, return Unauthorized error
		c.JSON(http.StatusForbidden, gin.H{"message": "Invalid credentials", "fieldError": "unauthorized"})
		return
	}

	// Generate JWT token for the logged-in user
	token, expiration, err := GenerateJWT(storedUser.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create token"})
		return
	}

	// Send the token back to the user in the response
	c.JSON(http.StatusOK, gin.H{"token": token, "expiration": expiration, "id": storedUser.ID, "user": storedUser.Username})
}
