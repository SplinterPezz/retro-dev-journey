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

type TrackData struct {
	Date             string  `json:"date" bson:"date"`
	UUID             string  `json:"uuid" bson:"uuid"`
	Type             string  `json:"type" bson:"type"`
	Info             *string `json:"info,omitempty" bson:"info,omitempty"`
	Time             *int    `json:"time,omitempty" bson:"time,omitempty"`
	Page             string  `json:"page" bson:"page"`
	Device           string  `json:"device" bson:"device"`
	ScreenResolution *string `json:"screenResolution,omitempty" bson:"screenResolution,omitempty"`
	Browser          *string `json:"browser,omitempty" bson:"browser,omitempty"`
	OS               *string `json:"os,omitempty" bson:"os,omitempty"`
}
