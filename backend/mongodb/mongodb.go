package mongodb

import (
	"backend/internal/models"
	"backend/internal/utils"

	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"golang.org/x/crypto/bcrypt"
)

// Global variable to hold the MongoDB client
var Client *mongo.Client
var usersCollection *mongo.Collection
var trkCollection *mongo.Collection

// InitMongoDB initializes the MongoDB connection and assigns it to the global Client variable
func InitMongoDB() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get MongoDB connection details from environment variables
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI is not set in environment variables")
	}

	mongoUser := os.Getenv("MONGO_USERNAME")
	mongoPassword := os.Getenv("MONGO_PASSWORD")

	// Set up client options
	clientOptions := options.Client().ApplyURI(mongoURI)

	// If authentication is required, set up the credentials
	if mongoUser != "" && mongoPassword != "" {
		clientOptions.SetAuth(options.Credential{
			Username: mongoUser,
			Password: mongoPassword,
		})
	}

	// Attempt to connect to MongoDB
	var errConnect error
	Client, errConnect = mongo.Connect(context.Background(), clientOptions)
	if errConnect != nil {
		log.Fatal("Failed to connect to MongoDB:", errConnect)
	}

	// Ping MongoDB to ensure the connection is established
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = Client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		log.Fatal("DB_NAME is not set in environment variables")
	}

	usersCollection = Client.Database(dbName).Collection("users")
	trkCollection = Client.Database(dbName).Collection("trk")

	CreateAnalyticsIndexes()

	fmt.Println("Connected to MongoDB and initialized collection with !")

	rootUsername := os.Getenv("ROOT_USERNAME")
	if rootUsername == "" {
		log.Fatal("ROOT_USERNAME missing on env file")
	}

	storedUser, err := FindUserByUsernameOrEmail(rootUsername)
	if err != nil || storedUser == nil {
		fmt.Println("Root user doesnt exists, creating Root user")

		CreateRootUser()

	} else {
		fmt.Println("Root user already exists, skip creating user.")
	}

}

func CreateRootUser() (string, error) {
	rootUsername := os.Getenv("ROOT_USERNAME")
	rootPassword := os.Getenv("ROOT_PASSWORD")
	rootEmail := os.Getenv("ROOT_EMAIL")

	if rootUsername == "" || rootPassword == "" || rootEmail == "" {
		log.Fatal("ROOT_USERNAME or ROOT_PASSWORD or ROOT_EMAIL missing on env file")
	}

	user := models.User{
		Username: rootUsername,
		Password: rootPassword,
		Email:    rootEmail,
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Could not hash password : ", err.Error())
	}

	user.Password = string(hashedPassword)
	userId, err := CreateUser(user)

	// Create the user in the database
	if err != nil {
		log.Fatal("Could not create user : ", err.Error())
	}

	fmt.Println("Root user created with Id : ", userId)

	// Generate JWT token for the newly created user
	token, _, err := utils.GenerateJWT(user.Username)
	if err != nil {
		log.Fatal("Could not create token : ", err.Error())
	}

	fmt.Println("Root user created.")

	return token, err
}

// GetDatabase returns a MongoDB database by name
func GetDatabase(dbName string) *mongo.Database {
	if Client == nil {
		log.Fatal("MongoDB client is not initialized")
	}
	return Client.Database(dbName)
}

func GetUserByIds(userIds []string) ([]*models.UserResponse, error) {
	objectIds, err := convertToObjectIDs(userIds)
	if err != nil {
		return nil, fmt.Errorf("invalid chat ID format: %v", err)
	}
	filter := bson.M{"_id": bson.M{"$in": objectIds}}

	cursor, err := usersCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var users []*models.UserResponse
	if err := cursor.All(context.Background(), &users); err != nil {
		return nil, err
	}

	if users == nil {
		users = []*models.UserResponse{}
	}

	return users, nil
}

func convertToObjectIDs(stringIds []string) ([]primitive.ObjectID, error) {
	var objectIDs []primitive.ObjectID

	for _, stingId := range stringIds {
		objID, err := primitive.ObjectIDFromHex(stingId)
		if err != nil {
			return nil, fmt.Errorf("invalid chat ID format: %v", err)
		}
		objectIDs = append(objectIDs, objID)
	}

	return objectIDs, nil
}

func CloseMongoDB() {
	if Client != nil {
		err := Client.Disconnect(context.Background())
		if err != nil {
			log.Fatal("Failed to disconnect from MongoDB:", err)
		}
		fmt.Println("MongoDB connection closed")
	}
}

func FindUserByEmailRegistration(email string) (*models.User, error) {
	var user models.User
	// Use bson.M{} to search for the user by username
	err := usersCollection.FindOne(context.Background(), bson.M{"email": email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return &user, nil
}

func FindUserByUsername(username string, returnErrorIfNotFound bool) (*models.User, error) {
	var user models.User
	// Search for the user by username
	err := usersCollection.FindOne(context.Background(), bson.M{"username": username}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			if returnErrorIfNotFound {
				return nil, fmt.Errorf("user not found")
			}
			return nil, nil // No error returned if user is not found for registration check
		}
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return &user, nil
}

func FindUserByUsernameOrEmail(usernameOrEmail string) (*models.User, error) {
	var user models.User
	// Use bson.M{} to search for the user by username or email
	err := usersCollection.FindOne(
		context.Background(),
		bson.M{
			"$or": []interface{}{
				bson.M{"username": usernameOrEmail},
				bson.M{"email": usernameOrEmail},
			},
		},
	).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return &user, nil
}

// CreateUser inserts a new user into the MongoDB collection
// Function used to create root user on startup.
// Function disabled in API
func CreateUser(user models.User) (string, error) {
	// Insert the User into the collection
	data, err := usersCollection.InsertOne(context.Background(), user)
	if err != nil {
		return "", fmt.Errorf("error inserting user: %v", err)
	}
	id, ok := data.InsertedID.(primitive.ObjectID)
	if !ok {
		return "", fmt.Errorf("error converting inserted ID ObjectId")
	}

	return id.Hex(), nil
}

func FindUserById(userID string) (*models.User, error) {
	var user models.User
	userObjectId, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID format: %v", err)
	}

	filter := bson.M{"_id": userObjectId}
	err = usersCollection.FindOne(context.Background(), filter).Decode(&user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func SaveTrackData(trackData models.TrackData) {
	_, err := trkCollection.InsertOne(context.Background(), trackData)

	if err != nil {
		fmt.Println("Error on insert TrackData", err)
	}
}

func GetDailyUniqueUsers(dateFilter models.DateRangeFilter) ([]models.DailyUserStats, error) {
	fmt.Println("dateFilter", dateFilter)

	pipeline := mongo.Pipeline{

		// Match date range
		{{Key: "$match", Value: bson.M{
			"date": bson.M{
				"$gte": dateFilter.StartDate.Format("2006-01-02"),
				"$lt":  dateFilter.EndDate.AddDate(0, 0, 1).Format("2006-01-02"),
			},
		}}},

		// Extract date from datetime and group by date and uuid
		{{Key: "$addFields", Value: bson.M{
			"dateOnly": bson.M{"$substr": []interface{}{"$date", 0, 10}},
		}}},

		// Group by date and uuid to get unique users per day
		{{Key: "$group", Value: bson.M{
			"_id": bson.M{
				"date": "$dateOnly",
				"uuid": "$uuid",
			},
		}}},

		// Group by date to count unique users
		{{Key: "$group", Value: bson.M{
			"_id":         "$_id.date",
			"uniqueUsers": bson.M{"$sum": 1},
		}}},

		// Sort by date
		{{Key: "$sort", Value: bson.M{"_id": 1}}},
	}

	cursor, err := trkCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, fmt.Errorf("error aggregating daily unique users: %v", err)
	}
	defer cursor.Close(context.Background())

	var results []models.DailyUserStats
	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, fmt.Errorf("error decoding daily unique users: %v", err)
	}

	return results, nil
}

func GetAverageTimePerPage(dateFilter models.DateRangeFilter) ([]models.PageTimeStats, error) {
	pipeline := mongo.Pipeline{
		// Match date range and view type - extend end date to include full day
		{{Key: "$match", Value: bson.M{
			"date": bson.M{
				"$gte": dateFilter.StartDate.Format("2006-01-02"),
				"$lt":  dateFilter.EndDate.AddDate(0, 0, 1).Format("2006-01-02"), // Next day
			},
			"type": "view",
			"time": bson.M{"$exists": true, "$ne": nil},
		}}},

		// Extract date from datetime
		{{Key: "$addFields", Value: bson.M{
			"dateOnly": bson.M{"$substr": []interface{}{"$date", 0, 10}},
		}}},

		// First: Group by date, page, and uuid to get max time per user
		{{Key: "$group", Value: bson.M{
			"_id": bson.M{
				"date": "$dateOnly",
				"page": "$page",
				"uuid": "$uuid",
			},
			"maxTimePerUser": bson.M{"$max": "$time"},
		}}},

		// Second: Group by date and page to calculate average of max times and count unique users
		{{Key: "$group", Value: bson.M{
			"_id": bson.M{
				"date": "$_id.date",
				"page": "$_id.page",
			},
			"averageTime": bson.M{"$avg": "$maxTimePerUser"},
			"uniqueUsers": bson.M{"$sum": 1},
		}}},

		// Reshape the output
		{{Key: "$project", Value: bson.M{
			"_id":         0,
			"date":        "$_id.date",
			"page":        "$_id.page",
			"averageTime": bson.M{"$round": []interface{}{"$averageTime", 2}},
			"uniqueUsers": "$uniqueUsers",
		}}},

		// Sort by date and page
		{{Key: "$sort", Value: bson.M{"date": 1, "page": 1}}},
	}

	cursor, err := trkCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, fmt.Errorf("error aggregating page time stats: %v", err)
	}
	defer cursor.Close(context.Background())

	var results []models.PageTimeStats
	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, fmt.Errorf("error decoding page time stats: %v", err)
	}

	return results, nil
}

func GetDailyDownloads(dateFilter models.DateRangeFilter) ([]models.DownloadStats, error) {
	pipeline := mongo.Pipeline{
		// Match date range, interaction type, and download info
		{{Key: "$match", Value: bson.M{
			"date": bson.M{
				"$gte": dateFilter.StartDate.Format("2006-01-02"),
				"$lt":  dateFilter.EndDate.AddDate(0, 0, 1).Format("2006-01-02"),
			},
			"type": "interaction",
			"info": "download",
		}}},

		// Extract date from datetime
		{{Key: "$addFields", Value: bson.M{
			"dateOnly": bson.M{"$substr": []interface{}{"$date", 0, 10}},
		}}},

		// Group by date and page
		{{Key: "$group", Value: bson.M{
			"_id": bson.M{
				"date": "$dateOnly",
				"page": "$page",
			},
			"downloads": bson.M{"$sum": 1},
		}}},

		{{Key: "$project", Value: bson.M{
			"_id":       0,
			"date":      "$_id.date",
			"page":      "$_id.page",
			"downloads": "$downloads",
		}}},
		// Sort by date and page
		{{Key: "$sort", Value: bson.M{"date": 1, "page": 1}}},
	}

	cursor, err := trkCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, fmt.Errorf("error aggregating download stats: %v", err)
	}
	defer cursor.Close(context.Background())

	var results []models.DownloadStats
	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, fmt.Errorf("error decoding download stats: %v", err)
	}

	return results, nil
}

func GetInteractionStats(dateFilter models.DateRangeFilter) ([]models.InteractionStats, error) {
	pipeline := mongo.Pipeline{
		// Match date range and interaction type
		{{Key: "$match", Value: bson.M{
			"date": bson.M{
				"$gte": dateFilter.StartDate.Format("2006-01-02"),
				"$lt":  dateFilter.EndDate.AddDate(0, 0, 1).Format("2006-01-02"),
			},
			"type": "interaction",
			"info": bson.M{"$exists": true, "$ne": nil},
		}}},

		// Group by info
		{{Key: "$group", Value: bson.M{
			"_id":   "$info",
			"count": bson.M{"$sum": 1},
		}}},

		// Sort by count descending
		{{Key: "$sort", Value: bson.M{"count": -1}}},
	}

	cursor, err := trkCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, fmt.Errorf("error aggregating interaction stats: %v", err)
	}
	defer cursor.Close(context.Background())

	var results []models.InteractionStats
	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, fmt.Errorf("error decoding interaction stats: %v", err)
	}

	return results, nil
}

func GetDeviceStats(dateFilter models.DateRangeFilter) ([]models.DeviceStats, error) {
	pipeline := mongo.Pipeline{
		// Match date range
		{{Key: "$match", Value: bson.M{
			"date": bson.M{
				"$gte": dateFilter.StartDate.Format("2006-01-02"),
				"$lt":  dateFilter.EndDate.AddDate(0, 0, 1).Format("2006-01-02"),
			},
		}}},

		// Group by device and uuid to avoid counting same user multiple times
		{{Key: "$group", Value: bson.M{
			"_id": bson.M{
				"device": "$device",
				"uuid":   "$uuid",
			},
		}}},

		// Group by device to count unique users per device
		{{Key: "$group", Value: bson.M{
			"_id":   "$_id.device",
			"count": bson.M{"$sum": 1},
		}}},

		// Sort by count descending
		{{Key: "$sort", Value: bson.M{"count": -1}}},
	}

	cursor, err := trkCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, fmt.Errorf("error aggregating device stats: %v", err)
	}
	defer cursor.Close(context.Background())

	var results []models.DeviceStats
	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, fmt.Errorf("error decoding device stats: %v", err)
	}

	return results, nil
}

func GetBrowserStats(dateFilter models.DateRangeFilter) ([]models.BrowserStats, error) {
	pipeline := mongo.Pipeline{

		// Match date range and browser exists
		{{Key: "$match", Value: bson.M{
			"date": bson.M{
				"$gte": dateFilter.StartDate.Format("2006-01-02"),
				"$lt":  dateFilter.EndDate.AddDate(0, 0, 1).Format("2006-01-02"),
			},
			"browser": bson.M{"$exists": true, "$ne": nil},
		}}},

		// Group by browser and uuid to avoid counting same user multiple times
		{{Key: "$group", Value: bson.M{
			"_id": bson.M{
				"browser": "$browser",
				"uuid":    "$uuid",
			},
		}}},

		// Group by browser to count unique users per browser
		{{Key: "$group", Value: bson.M{
			"_id":   "$_id.browser",
			"count": bson.M{"$sum": 1},
		}}},

		// Sort by count descending
		{{Key: "$sort", Value: bson.M{"count": -1}}},
	}

	cursor, err := trkCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, fmt.Errorf("error aggregating browser stats: %v", err)
	}
	defer cursor.Close(context.Background())

	var results []models.BrowserStats
	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, fmt.Errorf("error decoding browser stats: %v", err)
	}

	return results, nil
}

func CreateAnalyticsIndexes() {
	if trkCollection == nil {
		log.Fatal("Analytics collection not initialized")
		return
	}

	dateTypeIndex := mongo.IndexModel{
		Keys: bson.D{
			{"date", 1},
			{"type", 1},
		},
	}

	dateUuidIndex := mongo.IndexModel{
		Keys: bson.D{
			{"date", 1},
			{"uuid", 1},
		},
	}

	dateTypePageTimeIndex := mongo.IndexModel{
		Keys: bson.D{
			{"date", 1},
			{"type", 1},
			{"page", 1},
			{"time", 1},
		},
	}

	dateTypeInfoIndex := mongo.IndexModel{
		Keys: bson.D{
			{"date", 1},
			{"type", 1},
			{"info", 1},
		},
	}

	dateTypeInfoPageIndex := mongo.IndexModel{
		Keys: bson.D{
			{"date", 1},
			{"type", 1},
			{"info", 1},
			{"page", 1},
		},
	}

	dateDeviceUuidIndex := mongo.IndexModel{
		Keys: bson.D{
			{"date", 1},
			{"device", 1},
			{"uuid", 1},
		},
	}

	dateBrowserUuidIndex := mongo.IndexModel{
		Keys: bson.D{
			{"date", 1},
			{"browser", 1},
			{"uuid", 1},
		},
	}

	uuidIndex := mongo.IndexModel{
		Keys: bson.D{{"uuid", 1}},
	}

	pageIndex := mongo.IndexModel{
		Keys: bson.D{{"page", 1}},
	}

	uniqueTrackingIndex := mongo.IndexModel{
		Keys: bson.D{
			{"uuid", 1},
			{"page", 1},
			{"date", 1},
			{"type", 1},
			{"info", 1},
			{"time", 1},
		},
	}

	indexes := []mongo.IndexModel{
		dateTypeIndex,
		dateUuidIndex,
		dateTypePageTimeIndex,
		dateTypeInfoIndex,
		dateTypeInfoPageIndex,
		dateDeviceUuidIndex,
		dateBrowserUuidIndex,
		uuidIndex,
		pageIndex,
		uniqueTrackingIndex,
	}

	// Create indexes with error handling
	ctx := context.Background()
	names, err := trkCollection.Indexes().CreateMany(ctx, indexes)
	if err != nil {
		log.Printf("Error creating indexes: %v", err)
		return
	}

	fmt.Println("Analytics indexes created successfully:")
	for i, name := range names {
		fmt.Printf("%d. %s\n", i+1, name)
	}
}
