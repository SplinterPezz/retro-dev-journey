# frontend/Dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Set build-time environment variable
ARG APP_ENV=dev

# Copy the appropriate environment file based on APP_ENV
RUN if [ "$APP_ENV" = "prod" ]; then \
        cp .env.prod .env; \
    elif [ "$APP_ENV" = "stage" ]; then \
        cp .env.stage .env; \
    elif [ "$APP_ENV" = "dev" ]; then \
        cp .env.dev .env; \
    else \
        cp .env.local .env; \
    fi

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]