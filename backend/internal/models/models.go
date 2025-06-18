package models

import "time"

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

type DailyUserStats struct {
	Date        string `json:"date" bson:"_id"`
	UniqueUsers int    `json:"uniqueUsers" bson:"uniqueUsers"`
}

type PageTimeStats struct {
	Date        string  `json:"date" bson:"date"`
	Page        string  `json:"page" bson:"page"`
	AverageTime float64 `json:"averageTime" bson:"averageTime"`
	UniqueUsers int     `json:"uniqueUsers" bson:"uniqueUsers"`
}

type DownloadStats struct {
	Date      string `json:"date" bson:"date"`
	Page      string `json:"page" bson:"page"`
	Downloads int    `json:"downloads" bson:"downloads"`
}

type InteractionStats struct {
	Info  string `json:"info" bson:"_id"`
	Count int    `json:"count" bson:"count"`
}

type DeviceStats struct {
	Device string `json:"device" bson:"_id"`
	Count  int    `json:"count" bson:"count"`
}

type BrowserStats struct {
	Browser string `json:"browser" bson:"_id"`
	Count   int    `json:"count" bson:"count"`
}

type DateRangeFilter struct {
	StartDate time.Time
	EndDate   time.Time
}
