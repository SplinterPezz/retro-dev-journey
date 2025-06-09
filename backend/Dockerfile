FROM golang:1.24.3-alpine

# Install basic dependencies
RUN apk add --no-cache ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy all source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Ensure executable permissions
RUN chmod +x main

# Copy environment files (ignore errors if they don't exist)
COPY *.env ./

# Expose port
EXPOSE 8421

# Set environment
ENV APP_ENV=dev

# Run the application
CMD ["./main"]