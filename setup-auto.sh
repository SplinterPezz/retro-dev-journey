#!/bin/bash

# Retro Dev Journey - Auto Setup Script
# This script automatically configures the application with default values

set -e

echo "🎮 Retro Dev Journey - Auto Setup 🎮"
echo "======================================"
echo "Setting up your application with auto-generated values..."
echo ""

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

# Generate values
MONGO_USERNAME="retro_dev_journey_$(generate_password 10)"
MONGO_PASSWORD=$(generate_password 24)
JWT_SECRET=$(generate_password 32)
ROOT_USERNAME=$(generate_password 12)
ROOT_PASSWORD=$(generate_password 16)

echo "📊 Generated configuration values:"
echo "- MongoDB Username: $MONGO_USERNAME"
echo "- MongoDB Password: [HIDDEN]"
echo "- JWT Secret: [HIDDEN]"
echo "- Root Username: $ROOT_USERNAME"
echo "- Root Password: [HIDDEN]"
echo ""

# Create root .env file
echo "📁 Creating root .env file..."
cat > .env << 'EOF'
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
EOF

# Replace variables in the file
sed -i.bak "s/\${MONGO_USERNAME}/$MONGO_USERNAME/g" .env
sed -i.bak "s/\${MONGO_PASSWORD}/$MONGO_PASSWORD/g" .env
rm .env.bak 2>/dev/null || true

# Create backend directory if it doesn't exist
mkdir -p backend

echo "🔧 Creating backend environment files..."

# Backend .env.local
cat > backend/.env.local << 'EOF'
PORT=8421
ALLOW_ORIGIN='http://localhost:8422'

MONGO_URI='mongodb://db_retro_dev_journey:27017'
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
DB_NAME=retro_db

JWT_SECRET=${JWT_SECRET}

ROOT_USERNAME=${ROOT_USERNAME}
ROOT_PASSWORD=${ROOT_PASSWORD}
ROOT_EMAIL='it@retrojourney.dev'
EOF

# Replace variables in the file
sed -i.bak "s/\${MONGO_USERNAME}/$MONGO_USERNAME/g" backend/.env.local
sed -i.bak "s/\${MONGO_PASSWORD}/$MONGO_PASSWORD/g" backend/.env.local
sed -i.bak "s/\${JWT_SECRET}/$JWT_SECRET/g" backend/.env.local
sed -i.bak "s/\${ROOT_USERNAME}/$ROOT_USERNAME/g" backend/.env.local
sed -i.bak "s/\${ROOT_PASSWORD}/$ROOT_PASSWORD/g" backend/.env.local
rm backend/.env.local.bak 2>/dev/null || true

# Backend .env.dev (same as local for auto)
cp backend/.env.local backend/.env.dev

# Backend .env.prod
cat > backend/.env.prod << 'EOF'
PORT=8421
ALLOW_ORIGIN='https://retrojourney.dev'

MONGO_URI='mongodb://db_retro_dev_journey:27017'
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
DB_NAME=retro_db

JWT_SECRET=${JWT_SECRET}

ROOT_USERNAME=${ROOT_USERNAME}
ROOT_PASSWORD=${ROOT_PASSWORD}
ROOT_EMAIL='it@retrojourney.dev'
EOF

# Replace variables in the file
sed -i.bak "s/\${MONGO_USERNAME}/$MONGO_USERNAME/g" backend/.env.prod
sed -i.bak "s/\${MONGO_PASSWORD}/$MONGO_PASSWORD/g" backend/.env.prod
sed -i.bak "s/\${JWT_SECRET}/$JWT_SECRET/g" backend/.env.prod
sed -i.bak "s/\${ROOT_USERNAME}/$ROOT_USERNAME/g" backend/.env.prod
sed -i.bak "s/\${ROOT_PASSWORD}/$ROOT_PASSWORD/g" backend/.env.prod
rm backend/.env.prod.bak 2>/dev/null || true

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
REACT_APP_API_URL="https://api.retrojourney.dev"
REACT_APP_ENV=production
EOF

echo ""
echo "✅ Auto setup completed successfully!"
echo ""
echo "📋 Summary:"
echo "- Root .env file created with MongoDB credentials"
echo "- Backend environment files created (.env.local, .env.dev, .env.prod)"
echo "- Frontend environment files created (.env.local, .env.dev, .env.prod)"
echo ""
echo "🔐 Important: Save these credentials securely:"
echo "- Root Username: $ROOT_USERNAME"
echo "- Root Password: [HIDDEN]"
echo "- MongoDB Username: $MONGO_USERNAME"
echo ""
echo "🚀 Your application is ready to run!"
echo "   Use 'docker-compose up' or your preferred method to start the services."