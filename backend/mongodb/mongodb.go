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

	// Select the database and initialize the colletions
	dbName := os.Getenv("DB_NAME") // Get the database name from environment variable
	if dbName == "" {
		log.Fatal("DB_NAME is not set in environment variables")
	}

	usersCollection = Client.Database(dbName).Collection("users") // Set the users collection
	trkCollection = Client.Database(dbName).Collection("trk")     // Set the trk collection

	fmt.Println("Connected to MongoDB and initialized users collection!")
	//ROOT_USERNAME='admin'
	//ROOT_PASSWORD='Z8a8vtY5cyfQBOgh30P6k'
	//ROOT_EMAIL='it@devjourney.com'
	rootUsername := os.Getenv("ROOT_USERNAME")
	if rootUsername == "" {
		log.Fatal("ROOT_USERNAME missing on env file")
	}

	storedUser, err := FindUserByUsernameOrEmail(rootUsername)
	if err != nil || storedUser == nil {
		// If Root user is not found it will be created
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

// CloseMongoDB gracefully closes the MongoDB client
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
