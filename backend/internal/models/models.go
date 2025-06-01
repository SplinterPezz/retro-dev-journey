package models

// User represents a basic user model used in both authentication and MongoDB
type User struct {
	ID       string `json:"id" bson:"_id,omitempty"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type UserResponse struct {
	ID       string `json:"id" bson:"_id,omitempty"`
	Username string `json:"username"`
}
