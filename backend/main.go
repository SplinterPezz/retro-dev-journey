package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"backend/internal/auth"
	"backend/internal/handlers"
	"backend/internal/tenant"
	"backend/mongodb"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func loadEnvFile() {
	// Load environment variables
	appEnv := os.Getenv("APP_ENV")
	if appEnv == "" {
		appEnv = "local"
	}

	var envFile string
	switch appEnv {
	case "prod":
		envFile = ".env.prod"
	case "dev":
		envFile = ".env.dev"
	default:
		envFile = ".env.local"
	}

	err := godotenv.Load(envFile)
	if err != nil {
		log.Fatalf("Error loading .env file for environment %s: %v", appEnv, err)
	}

	fmt.Printf("Loaded environment configuration from %s\n", envFile)
}

func main() {
	// Load environment variables
	loadEnvFile()

	// Initialize MongoDB connection
	mongodb.InitMongoDB()

	// Create a Gin router instance
	r := gin.Default()

	// CORS accepts any Origin that belongs to a configured tenant. This must
	// run before TenantMiddleware so that OPTIONS preflight requests (which
	// gin-contrib/cors answers directly) never reach it.
	config := cors.Config{
		AllowOriginFunc: func(origin string) bool {
			_, ok := tenant.ByOrigin(origin)
			return ok
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // Allow all necessary methods
		AllowHeaders:     []string{"Content-Type", "Authorization"},          // Include Authorization header
		ExposeHeaders:    []string{"Content-Length"},                        // Optional: Expose headers to the client
		AllowCredentials: true,                                              // Allow cookies and credentials if needed
	}
	r.Use(cors.New(config))
	r.Use(auth.TenantMiddleware) // Resolve which tenant this request belongs to
	r.Use(auth.JWTMiddleware)    // Apply JWT middleware globally

	//r.POST("/register", auth.Register)
	r.POST("/login", auth.Login)

	// Public routes (no authentication required)
	r.GET("/cv/download", handlers.DownloadCV)

	// Tracking Route for users
	r.POST("/info", handlers.TrackData)

	// Protected routes (authentication required)

	r.POST("/cv/upload", handlers.UploadCV)

	// Analytics Routes for admin area
	analyticsGroup := r.Group("/analytics")
	{
		analyticsGroup.GET("/daily-users", handlers.GetDailyUniqueUsers)
		analyticsGroup.GET("/page-time", handlers.GetPageTimeStats)
		analyticsGroup.GET("/downloads", handlers.GetDownloadStats)
		analyticsGroup.GET("/interactions", handlers.GetInteractionStats)
		analyticsGroup.GET("/devices", handlers.GetDeviceStats)
		analyticsGroup.GET("/browsers", handlers.GetBrowserStats)
	}

	// Start HTTP server
	server := &http.Server{
		Addr:         fmt.Sprintf(":%s", os.Getenv("PORT")),
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	// Start the server in a goroutine
	go func() {
		fmt.Println("Starting server on port", os.Getenv("PORT"))
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("ListenAndServe(): ", err)
		}
	}()

	// Graceful shutdown handling
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	// Graceful shutdown: shut down the server and MongoDB connection
	fmt.Println("Shutting down server...")
	if err := server.Close(); err != nil {
		log.Fatal("Server close:", err)
	}

	mongodb.CloseMongoDB()
}
