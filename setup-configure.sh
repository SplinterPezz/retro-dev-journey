#!/bin/bash

# Retro Dev Journey - Manual Configuration Script
# This script guides you through manual configuration of the application

set -e

echo "🎮 Retro Dev Journey - Manual Configuration 🎮"
echo "=============================================="
echo "This script will guide you through configuring your application."
echo "Please provide the requested information when prompted."
echo ""

# Function to read input with default value
read_input() {
    local prompt="$1"
    local default="$2"
    local variable_name="$3"
    
    if [ -n "$default" ]; then
        echo -n "$prompt [$default]: "
    else
        echo -n "$prompt: "
    fi
    
    read user_input
    
    if [ -z "$user_input" ] && [ -n "$default" ]; then
        user_input="$default"
    fi
    
    eval "$variable_name='$user_input'"
}

# Function to generate random alphanumeric string
generate_password() {
    local length=${1:-16}

    if [ "$length" -lt 8 ]; then
        echo "Password length must be at least 8 characters." >&2
        return 1
    fi

    local password=""
    local upper_chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    local lower_chars="abcdefghijklmnopqrstuvwxyz"
    local digits="0123456789"
    local all_chars="${upper_chars}${lower_chars}${digits}"

    # Use openssl or fallback for random generation
    get_random_chars() {
        if command -v openssl >/dev/null 2>&1; then
            openssl rand -base64 48 | tr -dc "$1" | head -c "$2"
        else
            LC_ALL=C tr -dc "$1" < /dev/urandom | head -c "$2"
        fi
    }

    # Ensure at least one uppercase, one lowercase, one digit
    password+=$(get_random_chars "$upper_chars" 1)
    password+=$(get_random_chars "$lower_chars" 1)
    password+=$(get_random_chars "$digits" 1)

    # Fill the rest with random allowed characters
    password+=$(get_random_chars "$all_chars" $((length - 3)))

    # Shuffle password to randomize character positions
    password=$(echo "$password" | fold -w1 | shuf | tr -d '\n')

    echo "$password"
}

# Function to read password (hidden input)
read_password() {
    local prompt="$1"
    local variable_name="$2"
    
    echo -n "$prompt: "
    read -s user_input
    echo ""
    eval "$variable_name='$user_input'"
}

echo "📊 MongoDB Configuration"
echo "========================"
read_input "MongoDB Username" "" "MONGO_USERNAME"
# Auto-generate if empty
if [ -z "$MONGO_USERNAME" ]; then
    MONGO_USERNAME="retro_dev_journey_$(generate_password 8)"
    echo "   Generated MongoDB Username: $MONGO_USERNAME"
fi

read_password "MongoDB Password" "MONGO_PASSWORD"
# Auto-generate if empty
if [ -z "$MONGO_PASSWORD" ]; then
    MONGO_PASSWORD=$(generate_password 24)
    echo "   Generated MongoDB Password: $MONGO_PASSWORD"
fi

read_input "Database Name" "retro_db" "DB_NAME"

echo ""
echo "🔐 Security Configuration"
echo "========================="
read_password "JWT Secret (for token signing)" "JWT_SECRET"
# Auto-generate if empty
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(generate_password 64)
    echo "   Generated JWT Secret: [HIDDEN]"
fi

echo ""
echo "👤 Root User Configuration"
echo "==========================="
read_input "Root Username" "" "ROOT_USERNAME"
# Auto-generate if empty
if [ -z "$ROOT_USERNAME" ]; then
    ROOT_USERNAME=$(generate_password 12)
    echo "   Generated Root Username: $ROOT_USERNAME"
fi

read_password "Root Password" "ROOT_PASSWORD"
while ! [[ ${#ROOT_PASSWORD} -ge 8 && "$ROOT_PASSWORD" =~ [A-Z] && "$ROOT_PASSWORD" =~ [a-z] && "$ROOT_PASSWORD" =~ [0-9] ]]; do
    echo "Invalid Root Password. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
    read_password "Please re-enter Root Password" "ROOT_PASSWORD"
done

echo ""
echo "🌐 Domain Configuration"
echo "======================="
read_input "Frontend Domain (without https://)" "retrojourney.dev" "FRONTEND_DNS"
read_input "Backend API Domain (without https://)" "api.retrojourney.dev" "BACKEND_DNS"

# Construct email
ROOT_EMAIL="it@$FRONTEND_DNS"

echo ""
echo "📋 Configuration Summary:"
echo "========================="
echo "- MongoDB Username: $MONGO_USERNAME"
echo "- Database Name: $DB_NAME"
echo "- Root Username: $ROOT_USERNAME"
echo "- Frontend Domain: $FRONTEND_DNS"
echo "- Backend Domain: $BACKEND_DNS"
echo "- Root Email: $ROOT_EMAIL"
echo ""

read -p "Do you want to proceed with this configuration? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "Configuration cancelled."
    exit 1
fi

echo ""
echo "📁 Creating configuration files..."

# Create root .env file
echo "Creating root .env file..."
cat > .env << EOF
MONGO_USERNAME=$MONGO_USERNAME
MONGO_PASSWORD=$MONGO_PASSWORD
EOF

# Create backend directory if it doesn't exist
mkdir -p backend

echo "🔧 Creating backend environment files..."

# Backend .env.local
cat > backend/.env.local << EOF
PORT=8421
ALLOW_ORIGIN='http://localhost:8422'

MONGO_URI='mongodb://db_retro_dev_journey:27017'
MONGO_USERNAME=$MONGO_USERNAME
MONGO_PASSWORD=$MONGO_PASSWORD
DB_NAME=$DB_NAME

JWT_SECRET=$JWT_SECRET

ROOT_USERNAME=$ROOT_USERNAME
ROOT_PASSWORD=$ROOT_PASSWORD
ROOT_EMAIL=$ROOT_EMAIL
EOF

# Backend .env.dev (same as local for development)
cp backend/.env.local backend/.env.dev

# Backend .env.prod
cat > backend/.env.prod << EOF
PORT=8421
ALLOW_ORIGIN='https://$FRONTEND_DNS'

MONGO_URI='mongodb://db_retro_dev_journey:27017'
MONGO_USERNAME=$MONGO_USERNAME
MONGO_PASSWORD=$MONGO_PASSWORD
DB_NAME=$DB_NAME

JWT_SECRET=$JWT_SECRET

ROOT_USERNAME=$ROOT_USERNAME
ROOT_PASSWORD=$ROOT_PASSWORD
ROOT_EMAIL=$ROOT_EMAIL
EOF

# Create frontend directory if it doesn't exist
mkdir -p frontend

echo "🎨 Creating frontend environment files..."

# Frontend .env.local
cat > frontend/.env.local << EOF
REACT_APP_API_URL="http://localhost:8421"
REACT_APP_ENV=development
EOF

# Frontend .env.dev (same as local)
cp frontend/.env.local frontend/.env.dev

# Frontend .env.prod
cat > frontend/.env.prod << EOF
REACT_APP_API_URL="https://$BACKEND_DNS"
REACT_APP_ENV=production
EOF

echo ""
echo "✅ Manual configuration completed successfully!"
echo ""
echo "📋 Summary:"
echo "- Root .env file created with MongoDB credentials"
echo "- Backend environment files created (.env.local, .env.dev, .env.prod)"
echo "- Frontend environment files created (.env.local, .env.dev, .env.prod)"
echo ""
echo "🔐 Important: Keep these credentials secure:"
echo "- Root Username: $ROOT_USERNAME"
echo "- MongoDB Username: $MONGO_USERNAME"
echo "- Database: $DB_NAME"
echo ""
echo "🚀 Your application is ready to run!"
echo "   Use 'docker-compose up' or your preferred method to start the services."