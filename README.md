# 🎮 Retro Dev Journey

[![React](https://img.shields.io/badge/React-19.3.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Go](https://img.shields.io/badge/Go-1.24.3-00ADD8?style=flat&logo=go)](https://golang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.10.0-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Interactive Portfolio & CV built with React featuring a unique pixel-art timeline design, to explore freely (Sandbox) or chapter by chapter (Story Mode). Tracks user interactions with a simple Go backend and MongoDB storage. Includes a basic admin dashboard to monitor site usage and engagement metrics.**

**Live version [Here](https://retrojourney.dev/)** at https://retrojourney.dev/

**React + Go + MongoDB**
<div align="left">
  <img src="./frontend/public/sprites/player/dude_walk_S.gif" width="150">
  <img src="./frontend/public/sprites/statues/react.png" width="150">
  <img src="./frontend/public/sprites/statues/golang.png" width="150">
  <img src="./frontend/public/sprites/statues/mongodb.png" width="150">
</div>

> 🚀 **FULL Development Timeline:** 2 weeks development + 1 week debugging

---

## Fast Deploy with Docker

Want to try it right away? The application includes automated setup scripts for quick deployment!

### Requirements
- **Docker**
- **Git** (Optional or download ZIP)

### Quick Setup Options

#### Option 1: Fully Automated Setup (Recommended)
```bash
git clone https://github.com/SplinterPezz/retro-dev-journey
cd retro-dev-journey
sh setup-auto.sh && docker compose up -d
```
This will automatically create environment files (.env) with randomly generated secure passwords and usernames. Perfect for testing or development environments on localhost.

#### Option 2: Manual Configuration
```bash
git clone https://github.com/SplinterPezz/retro-dev-journey
cd retro-dev-journey
sh setup.sh && docker compose up -d
```
This allows you to manually input passwords and usernames with sensible default values. Ideal when you want control over the configuration.

> 🎯 **That's it!** The application will be available at `http://localhost:8422` and the admin panel at `http://localhost:8422/admin`

### What the Setup Scripts Do:
- **Environment File Creation**: Automatically generates `.env` files for both frontend and backend
- **Database Configuration**: Sets up MongoDB connection strings and credentials with env files
- **JWT Security**: Generates secure JWT secrets for authentication and password encrypt
- **Docker Containers**: Configures multi-container deployment with proper networking

<div align="left">
  <img src="./screenshots/other/setup.png" width="800">
</div>

# Auto Setup

<div align="left">
  <img src="./screenshots/other/setup_auto.png" width="800">
</div>

The Docker setup leverages multi-stage builds to optimize container sizes and includes health checks to ensure all services are running correctly. The compose configuration handles service dependencies, ensuring MongoDB starts before the backend, which starts before the frontend.

<div align="left">
  <img src="./screenshots/other/docker_1.png" width="800">
  <img src="./screenshots/other/docker_stats.png" width="800">
</div>

The environment files could be optimized by using a single env file for both the database and backend, but I preferred to keep them separated.

<div align="left">
  <img src="./screenshots/other/BE_env.png" width="250">
  <img src="./screenshots/other/FE_env.png" width="250">
  <img src="./screenshots/other/mongo_env.png" width="250">
</div>

---

## 📋 Requirements without Docker

| Technology | Version | Notes |
|------------|---------|-------|
| **Node.js** | 24 LTS (22.13+ works) | Vite 8 and ESLint 10 need 22.13 or newer |
| **NPM** | 10.9.2 | Package manager |
| **Go** | 1.24.3 | Backend language |
| **MongoDB** | 8.10.0 | Database system |
| **Air (optional)** | v1.62.0 | Go hot reload tool |

> ⚠️ **Version Compatibility:** Docker and MongoDB should work with older versions. However, Node.js, NPM, and Go versions haven't been tested with older releases. All development was done using LTS versions for maximum stability.


---

## ⏱️ Development Timeline
**Week 1: Foundation (7 days)**
* **Day 1**: Research pixel art games, RPG UI frameworks, and portfolio inspiration
* **Days 2-3**: Project architecture, Docker setup, MongoDB schema design
* **Days 4-5**: Midjourney asset generation, sprite optimization, visual design

**Week 2: Core Development (7 days)**
* **Days 6-12**: Frontend implementation - player movement, collision detection, mobile controls, path generation, UI components
* **Days 13-14**: Go backend with JWT auth, MongoDB integration, analytics engine, admin dashboard

**Week 3: Polish & Debug (7 days)**
* **Days 15-21**: Cross-browser compatibility, quest system, performance optimization, bug fixes and also this file.

---

## 📸 Screenshots

### Desktops


<div align="left">
  <img src="./screenshots/desktop/homepage.png" width="800">
  <img src="./screenshots/desktop/sandbox.png"  width="800">
</div>

<div align="left">
  <img src="./screenshots/desktop/login.png"  width="800">
  <img src="./screenshots/desktop/admin.png"  width="800">
</div>


### Mobile

<div align="left">
  <img src="./screenshots/mobile/homepage.png" width="250">
  <img src="./screenshots/mobile/welcome.png" width="250">
  <img src="./screenshots/mobile/sandbox.png" width="250">
</div>

<div align="left">
  <img src="./screenshots/mobile/sandbox_quest.png" width="250">
  <img src="./screenshots/mobile/login.png" width="250">
  <img src="./screenshots/mobile/admin_1.png" width="250">
</div>

---

## ✨ Key Features

- 🎮 **Interactive World** - Navigate through a pixel-art world representing career progression
- 📖 **Story Mode** - The career chapter by chapter: dialogues, quizzes and mini games on three difficulty levels, hidden collectibles, technologies unlocked along the way
- 📊 **Real-time Analytics** - Track user interactions with MongoDB storage and admin dashboard
- 📱 **Responsive Design** - Optimized for both desktop and mobile with touch controls
- 🛤️ **Dynamic Path Generation** - Automatically generated paths connecting career milestones
- 🎯 **Quest System** - Daily quest tracking for user engagement
- 🎵 **Audio Controls** - Immersive background music with volume controls
- 📄 **CV Management** - Secure upload/download functionality for CV files for fast update.

---

## 🛠️ Tech Stack & Library

### Backend (Go)
```
github.com/gin-contrib/cors v1.7.5       // CORS middleware
github.com/gin-gonic/gin v1.10.0         // Web framework
github.com/golang-jwt/jwt/v5 v5.2.2      // JWT authentication
github.com/joho/godotenv v1.5.1          // Environment variables
go.mongodb.org/mongo-driver v1.17.2      // MongoDB driver
golang.org/x/crypto v0.36.0              // Cryptographic functions
```

### Frontend (React + TypeScript, built with Vite)
```json
{
  "react": "^19.3.0",
  "react-dom": "^19.3.0",
  "@reduxjs/toolkit": "^2.13.0",
  "react-redux": "^9.3.0",
  "redux-persist": "^6.0.0",
  "react-router": "^7.18.4",
  "@mui/material": "^7.3.11", // Login card and admin area only
  "react-apexcharts": "^1.9.0", // Admin charts
  "@uiw/react-codemirror": "^4.25.12", // Code questions in Story Mode
  "react-joystick-component": "^6.2.1", // Can be easly removed by creating a custom one
  // dev: vite 8, vitest 5, typescript 6.0, eslint 10
}
```

---

## 🚀 Quick Start

### Prerequisites
```bash
# Verify installations
node --version    # Should be 22.13.0+
npm --version     # Should be 10.9.2+
go version        # Should be 1.24.3+
docker --version  # Should be 28.1.1+
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/retro-dev-journey.git
   cd retro-dev-journey
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Install Go dependencies
   go mod download
   
   # Copy environment file
   cp .env_example .env.local
   # Edit .env.local with your configuration
   
   # Run with hot reload (if Air is installed)
   air
   
   # OR run with standard Go
   go run main.go
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run start:loc    # Local environment
   npm run start:dev    # Development environment
   npm run start:stage  # Staging environment
   npm run start:prod   # Production environment
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (with Docker)
   docker compose up -d database
   
   # Or use your existing MongoDB installation updating the .env files on backend folder
   ```

### Access the Application
- **Frontend:** http://localhost:8422
- **Backend API:** http://localhost:8421
- **Admin Dashboard:** http://localhost:8422/admin (requires login)

---

## 🎮 Game Controls

### Desktop
- **Movement:** WASD or Arrow keys
- **Run:** Hold Shift or Spacebar while moving
- **Interaction:** Walk near buildings/technologies to view information

### Mobile
- **Movement:** Virtual joystick (bottom right)
- **Interaction:** Tap and move near structures

### Story Mode
- **Same movement** as above; walk up to people, quizzes and doors to interact
- **Dialogues:** tap or click the box to continue, pick an answer when asked

---

## 📁 Project Structure

```
retro-dev-journey/
├── backend/                 # Go backend application
│   ├── internal/           # Internal packages
│   │   ├── auth/          # Authentication logic
│   │   ├── handlers/      # HTTP handlers
│   │   ├── models/        # Data models
│   │   └── utils/         # Utility functions
│   │ 
│   ├── mongodb/           # Database connection and queries
│   ├── uploads/           # CV file storage folder
│   ├── Dockerfile         # Backend Docker container config
│   ├── go.mod             # Go dependencies
│   ├── go.sum             # Go dependencies
│   ├── air.toml           # Air config file
│   ├── main.go            # Application entry point
│   │ 
│   ├── .env               # Extra env file
│   ├── .env.dev           # Env File for development
│   ├── .env.local         # Env File for localhost
│   └── .env.prod          # Env File for production
│   
│ 
├── frontend/              # React frontend application
│   ├── public/            # Static assets
│   │   ├── sprites/       # Game sprites and images (story/ for Story Mode)
│   │   ├── backgrounds/   # Background images
│   │   ├── audio/         # Music files
│   │   ├── rpgui/         # RPGUI framework files
│   │   └── favicon.ico    # Favicon default folder
│   │ 
│   ├── index.html         # Page shell and SEO tags (Vite entry)
│   ├── vite.config.ts     # Vite, dev server and Vitest configuration
│   │ 
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── game/          # Engine shared by Sandbox and Story (movement, collisions, scene)
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store and persisted-state migrations
│   │   ├── config/        # World, career, story and environment settings
│   │   │   └── story/     # Story Mode: chapters, dialogues, quizzes, mini games, collectibles
│   │   ├── hooks/         # Hooks TS folder
│   │   └── types/         # TypeScript definitions
│   │ 
│   ├── Dockerfile         # Backend Docker container config
│   ├── package.json       # Frontend dependencies
│   ├── nginx.conf         # Nginx Configuration file for Docker
│   │ 
│   ├── .env.dev           # Env File for development
│   ├── .env.local         # Env File for localhost
│   └── .env.prod          # Env File for production
│ 
├── database/              # Database folder for future init script
├── .env                   # Env File for database
│ 
├── setup.sh               # Interactive setup script with configuration wizard
├── setup-auto.sh          # Automated setup with auto-generated credentials
├── setup-configure.sh     # Manual setup for user-provided credentials
├── clean_env.sh           # Utility to remove all generated .env files
│ 
└── README.md              # Project documentation
```

### 🎨 Sprite Organization

```
public/sprites/
├── buildings/              # Company/workplace buildings
│   ├── eikony.png         # First internship
│   ├── unipa.png          # University
│   ├── codesour.png       # Current company
│   └── new_opportunity.png # Future opportunities
│ 
├── statues/               # Technology representations
│   ├── java.png           # Java technology
│   ├── python.png         # Python technology
│   ├── javascript.png     # JavaScript technology
│   └── [other_tech].png   # Additional technologies
│ 
├── terrain/               # Ground and path textures
│   ├── main.png           # Grass texture
│   ├── path_core.png      # Basic path segment
│   ├── path_cross.png     # Path intersection
│   └── path_t_cross.png   # T-junction path
│ 
├── player/                # Character animations
│   ├── dude_idle.gif      # Idle animation
│   ├── dude_walk_N.gif    # Walking north
│   ├── dude_walk_S.gif    # Walking south
│   └── dude_walk_E.gif    # Walking east/west
│ 
├── trees/                 # Environmental decorations
├── details/               # Small decorative elements
├── signpost/              # Company signposts
│
└── story/                 # Story Mode
    ├── npc/               # Characters: idle, walk and turn gifs + the spec they were made from
    ├── companion/meep/    # Meep, in 8 directions
    ├── props/             # Classroom furniture, door, arrows, quiz marker
    ├── collectibles/      # Hidden objects and the collectible icon
    └── ui/                # Padlock, Meep at work, PC monitor
```
# Player sprites by [@marguels](https://github.com/marguels)

<div align="left">
  <img src="./frontend/public/sprites/player/dude-Sheet.png" width="950">
</div>

<div align="left">
  <img src="./frontend/public/sprites/player/dude_turn.gif" width="250">
  <img src="./frontend/public/sprites/player/dude_idle.gif" width="250">
  <img src="./frontend/public/sprites/player/dude_walk_E.gif" width="250">
  <img src="./frontend/public/sprites/player/dude_walk_SE.gif" width="250">
  <img src="./frontend/public/sprites/player/dude_walk_S.gif" width="250">
  <img src="./frontend/public/sprites/player/dude_walk_N.gif" width="250">
</div>

# Environments

<div align="left">
  <img src="./frontend/public/sprites/trees/palm_1.png" width="150">
  <img src="./frontend/public/sprites/trees/prickly_1.png" width="150">
  <img src="./frontend/public/sprites/trees/olive_1.png" width="150">
  <img src="./frontend/public/sprites/trees/orange_2.png" width="150">
  <img src="./frontend/public/sprites/trees/carrubba_2.png" width="150">
</div>

<div align="left">
  <img src="./frontend/public/sprites/statues/docker.png" width="150">
  <img src="./frontend/public/sprites/statues/python.png" width="150">
  <img src="./frontend/public/sprites/statues/java.png" width="150">
  <img src="./frontend/public/sprites/statues/sql.png" width="150">
  <img src="./frontend/public/sprites/statues/javascript.png" width="150">
</div>

<div align="left">
  <img src="./frontend/public/sprites/signpost/codesour_signpost.png" width="150">
  <img src="./frontend/public/sprites/signpost/alessi_signpost.png" width="150">
  <img src="./frontend/public/sprites/signpost/eikony_signpost.png" width="150">
  <img src="./frontend/public/sprites/signpost/unipa_signpost.png" width="150">
  <img src="./frontend/public/sprites/signpost/new_opportunity_signpost.png" width="150">
</div>

<div align="left">
  <img src="./frontend/public/sprites/buildings/unipa.png" width="250">
  <img src="./frontend/public/sprites/buildings/eikony.png" width="250">
  <img src="./frontend/public/sprites/buildings/new_opportunity.png" width="250">
</div>


---

## ⚙️ Configuration

### Frontend World Configuration (`frontend/src/config/`)

The game world is configured in plain TypeScript files:

- `world.ts`: world size, main path, player spawn and hitbox (shared by the Sandbox and the Story map)
- `career.ts`: companies (buildings) and technologies (statues)
- `environments.ts`: trees and small decorations
- `sandbox.ts`: Sandbox-only settings (music, background, Download CV button)
- `story/`: Story Mode, one file per concern:

| File | What it holds |
|------|---------------|
| `story/chapters.ts` | Chapter order, the building of each chapter, chapters still in development |
| `story/<chapter>.ts` | One chapter: room, props, NPCs and dialogues, quizzes, objectives, closing scene |
| `story/miniGames.ts`, `story/difficulty.ts` | Mini games and difficulty rules |
| `story/collectibles.ts` | Hidden collectibles per chapter |

Technologies in `career.ts` also name the chapter that unlocks them in Story Mode (`storyChapter`).

```typescript
// world.ts
export const worldConfig: WorldConfig = {
  width: 2000,           // World width in pixels
  height: 3024,          // World height in pixels
  tileSize: 128          // Size of each tile
};

// Path Configuration
export const mainPathConfig = {
  startX: worldConfig.width / 2,  // Path starting X position
  startY: 100,                    // Path starting Y position
  endY: worldConfig.height,       // Path ending Y position
  width: tileSize                 // Path width
};

// career.ts
const companiesData: CompanyData[] = [
  {
    id: "codesour",
    name: "CodeSour (IT)",
    role: "Software Developer",
    period: "2019 - 2025",
    technologies: ["Java", "Spring Boot", "ReactJS", "MongoDB"],
    description: "Developed scalable backend advertising platform...",
    position: { x: 652, y: 1540 },
    image: "/sprites/buildings/codesour.png",
    collisionHitbox: { x: -135, y: -500, width: 285, height: 470 }
  }
  // Additional companies...
];
```

### Backend Configuration example (`.env_example`)

```bash
# Server Configuration
PORT=8421
ALLOW_ORIGIN='http://localhost:3000'

# Database Configuration
MONGO_URI='mongodb://db_retro_dev_journey:27017'
MONGO_USERNAME='username'
MONGO_PASSWORD='really_strong_password'
DB_NAME='retro_db'

# Authentication
JWT_SECRET='my_secret_jwt'

# Admin User
ROOT_USERNAME='root_user'
ROOT_PASSWORD='Root_password00!'
ROOT_EMAIL='root@email.com'
```

### Frontend Configuration example (`.env_example`)

```bash
REACT_APP_API_URL="http://localhost:8421"
REACT_APP_ENV=development
```
### MongoDb Configuration example (`.env_example`)

```bash
MONGO_USERNAME=username
MONGO_PASSWORD=really_strong_password
```
---

## 🔧 Development Commands

### Frontend Development

```bash
# Install dependencies
npm install

# Development servers (different environments)
npm run start:loc    # Local environment (.env.local)
npm run start:dev    # Development environment (.env.dev)
npm run start:stage  # Staging environment (.env.stage)
npm run start:prod   # Production environment (.env.prod)

# Build commands
npm run build:local  # Build for local
npm run build:dev    # Build for development
npm run build:stage  # Build for staging
npm run build:prod   # Build for production

# Checks
npm test            # Run the tests once (Vitest)
npm run test:watch  # Re-run tests on change
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm run preview     # Serve the production build locally
```

### Backend Development

#### Standard Go Commands
```bash
# Install dependencies
go mod download

# Run application
go run main.go

# Build application
go build -o main .

# Set environment and run
APP_ENV=dev go run main.go
```

#### Air Hot Reload (Recommended)
If you have Air v1.62.0 installed (built with Go 1.24.3):

```bash
# Install Air (if not installed)
go install github.com/cosmtrek/air@latest

# Run with hot reload
air

# Air will automatically:
# - Watch for .go file changes
# - Rebuild the application
# - Restart the server
# - Exclude test files and tmp directory
```

---

## 🏗️ Core Features

### Interactive Game World

The application features a pixel-art top-down style, where users can:

- Navigate using WASD/Arrow keys (desktop) or joystick (mobile)
- Explore career milestones represented as buildings
- Interact with technology stacks shown as statues
- Follow automatically generated paths connecting experiences
- View detailed information dialogs when approaching structures

<div align="left">
  <img src="./screenshots/mobile/sandbox_quest.png" width="250">
  <img src="./screenshots/mobile/sandbox_tech.png" width="250">
  <img src="./screenshots/mobile/sandbox_structures.png" width="250">
</div>

<div align="left">
  <img src="./screenshots/desktop/sandbox_structures.png" width="760">
</div>

### Real-time Analytics

#### Tracking System
The application implements comprehensive user tracking:

- **Page Views:** Time spent on different sections
- **Interactions:** Which companies/technologies users explore
- **Device Analytics:** Mobile vs desktop usage patterns
- **Download Tracking:** CV download statistics
- **Quest Completion:** User engagement metrics

The analytics system employs a sophisticated event-driven architecture that captures user interactions without impacting performance. Each interaction is immediately queued and batch-processed to MongoDB using optimized aggregation pipelines for dashboard analytics. The system uses a random anonymous id (`crypto.randomUUID`) kept in the browser to tell unique visitors apart, with nothing derived from the device.

The tracking implements smart deduplication - rapid-fire interactions from the same user are filtered to prevent spam and ensure accurate metrics. Time tracking uses a progressive system that records milestones at 30 seconds, 1 minute, 2 minutes, 5 minutes, and 10 minutes, providing insights into engagement depth without overwhelming the database with constant updates.

# Desktop

<div align="left">
<img src="./screenshots/desktop/admin.png" width="800">
<img src="./screenshots/desktop/admin_2.png" width="800">
<img src="./screenshots/desktop/admin_3.png" width="800">
</div>

# Mobile
<div align="left">
  <img src="./screenshots/mobile/admin_1.png" width="250">
  <img src="./screenshots/mobile/admin_2.png" width="250">
  <img src="./screenshots/mobile/admin_3.png" width="250">
</div>

#### Privacy-Focused Approach
User privacy is prioritized throughout the application:

- **Anonymous Tracking:** No personal information collected or stored
- **Random IDs:** A random id stored in the browser, not derived from the device or from personal data
- **Data Minimization:** Only essential analytics data is captured
- **Automatic Cleanup:** Old interaction data is automatically purged
- **Transparent Tracking:** Users can see exactly what data is being collected

The privacy implementation includes automatic data retention policies that purge interaction data older than the current day, ensuring no long-term user tracking. The id is random and lives in the browser storage, so clearing the site data resets it, giving users control over their tracking footprint. (Before release 1.0 it was a hash of the device's details, shared by identical devices; a persisted-state migration drops the old one.)

### Quest System

The application gamifies exploration through a quest system:

- Daily quest reset functionality
- Progress tracking for each career milestone
- Visual progress indicators
- Completion of daily quest

The quest system leverages Redux Persist to maintain progress across browser sessions while implementing daily reset logic based on local date comparison. Each quest completion triggers visual feedback animations and updates the global progress calculation. The system tracks 23 distinct quest objectives (companies, technologies, and CV download) with smart completion detection based on proximity and interaction events.

Quest progress is calculated in real-time using interaction data from the Redux store, with completion status persisting locally but resetting daily to encourage repeat visits. The implementation includes smooth animations for progress bar updates and expandable quest panels that conserve screen space while maintaining accessibility.

<div align="left">
  <img src="./screenshots/desktop/quest_list.png" width="300">
  <img src="./screenshots/desktop/quest_list_2.png" width="400">
</div>

---

## 📖 Story Mode

Story Mode tells the same career as the Sandbox, one chapter at a time. Each chapter is a room to explore; between chapters the player crosses the story map to the next building.

- **Chapters** are plain config files (`config/story/<chapter>.ts`) with the room, props, NPCs, dialogues, quizzes, objectives and closing scene; `chapters.ts` sets their order. A chapter opens when the previous one is finished, and one still in development shows a "work in progress" window instead.
- **Difficulty** (Junior, Middle, Senior) is chosen once per story and changes the number of questions, the mistakes allowed and the points.
- **Dialogues** branch, remember the player's answers as flags and can pass from one character to another.
- **Quizzes and mini games** mix multiple choice with "fix the code" questions (CodeMirror).
- **The story map** lists every chapter (done, current, locked) and shows the technologies of the finished ones as statues.
- **Collectibles** are hidden in every chapter (`config/story/collectibles.ts`), with a counter of the ones found.
- **Meep**, a small companion, follows the player and comments along the way.
- **Progress** is saved in the browser per chapter (flags, scores, collectibles) with Redux Persist.

### Desktop

<div align="left">
  <img src="./screenshots/story/desktop_difficulty.jpg" width="400">
  <img src="./screenshots/story/desktop_intro.jpg" width="400">
</div>

<div align="left">
  <img src="./screenshots/story/desktop_prologue_debug.jpg" width="400">
  <img src="./screenshots/story/desktop_collectible.jpg" width="400">
</div>

<div align="left">
  <img src="./screenshots/story/desktop_map.jpg" width="400">
</div>

### Mobile

<div align="left">
  <img src="./screenshots/story/portrait_prologue.jpg" width="250">
  <img src="./screenshots/story/landscape_prologue.jpg" width="520">
</div>

---

## 🌐 API Endpoints

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/login` | POST | User authentication with JWT token generation |
| `/cv/download` | GET | Download the current CV file |
| `/info` | POST | Submit tracking data for analytics |

### Protected Endpoints (JWT Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/cv/upload` | POST | Upload new CV file (admin only) |
| `/analytics/daily-users` | GET | Get daily unique user statistics |
| `/analytics/page-time` | GET | Get average time spent per page |
| `/analytics/downloads` | GET | Get CV download statistics |
| `/analytics/interactions` | GET | Get user interaction data |
| `/analytics/devices` | GET | Get device usage statistics |
| `/analytics/browsers` | GET | Get browser usage statistics |

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based Authentication:** Secure token-based admin access
- **Password Hashing:** bcrypt with salt for secure password storage
- **Environment Variables:** Sensitive configuration kept separate from code
- **CORS Configuration:** Strict cross-origin resource sharing policies
- **Input Validation:** Server-side validation for all user inputs

### Privacy Protection
- **Anonymous Tracking:** No personal data collection
- **Random UUIDs:** User identification without personal or device information
- **Data Retention:** Automatic cleanup of old interaction data
- **Minimal Data Collection:** Only essential analytics data captured

---

## 🚀 Performance Optimizations

### Frontend Performance
- **Sprite Rendering:** CSS-based sprite animations with hardware acceleration
- **Memory Management:** Efficient Redux state management with selective persistence
- **Asset Optimization:** Compressed images and audio files
- **Code Splitting:** Dynamic imports reduce initial bundle size
- **RAF Optimization:** RequestAnimationFrame for smooth 60fps movement

### Backend Performance
- **Database Indexing:** Strategic indexes on frequently queried fields
- **Aggregation Pipelines:** Server-side data processing reduces client load
- **Connection Pooling:** Efficient MongoDB connection management
- **GZIP Compression:** Reduced payload sizes for faster data transfer
- **Caching Headers:** Appropriate cache control for static assets

---

## 🎯 Technical Deep Dive

### Path Generation Algorithm

The application features a sophisticated path generation system that automatically creates connecting paths between career milestones. The algorithm operates in three main phases:

1. **Main Path Generation:** Creates a central vertical path that serves as the career timeline backbone
2. **Branch Creation:** Generates horizontal branches from the main path to each career milestone (companies and technologies)
3. **Intersection Updates:** Intelligently updates path segments to create proper intersections, T-junctions, and crossroads

The path generation uses a smart coordinate system that calculates optimal branch points by finding the nearest Y-coordinate on the main path for each structure. The algorithm then determines branching direction (left or right) based on the structure's X-position relative to the central timeline. This creates an organic, tree-like structure that visually represents career progression while maintaining clean, navigable paths.

### Collision Detection System

The game implements precise hitbox-based collision detection for both player movement and structure interaction. Key features include:

- **Player Movement Blocking:** Prevents the character from walking through buildings and large structures
- **Interaction Zones:** Defines specific areas around structures where information dialogs appear
- **Smooth Movement:** Implements sliding along collision boundaries for natural movement feel
- **Debug Visualization:** Development mode shows hitboxes and interaction zones (in Story Mode also the collectibles) for easy debugging and adjustment

<div align="left">
  <img src="./screenshots/desktop/sandbox_debug.png" width="800">
  <img src="./screenshots/desktop/sandbox_debug_2.png" width="800">
</div>

Each structure can define custom collision boundaries separate from their visual representation, allowing for fine-tuned interaction zones. For example, a building might have a smaller collision box than its sprite to allow players to walk closer to the visual structure while still preventing overlap.

### Resource Loading and Optimization

Before a scene starts, its images (and the Sandbox music) are loaded with a visual progress bar, so the world appears complete instead of popping in; a file that fails to load is skipped instead of blocking the scene. Story chapters do the same behind their title screen, with an `X/Y Loading` counter. Each page is its own chunk (lazy routes), so a first visit downloads only the home page, and the code editor used by the quizzes loads only when a quiz needs it.

The loading page doesnt have a background for obvious reasons.

<div align="left">
  <img src="./screenshots/desktop/loading.png" width="800">
</div>

---

## 📱 Responsive Design

### Mobile Optimizations
- Touch-based joystick controls (pushed further to run)
- Responsive UI scaling, with dedicated layouts for portrait and landscape
- Mobile-specific welcome dialog
- Orientation choice for Story Mode and a fullscreen button

The virtual joystick uses a dead zone and its distance from the centre as speed, so a light touch walks and a full push runs. UI scaling relies on viewport units and breakpoints; landscape phones get compact layouts for dialogs, panels and popups so they fit the short screen.

### Desktop Features
- Keyboard navigation (WASD/Arrows + Shift for running)
- Advanced audio controls with volume management
- Enhanced admin dashboard with detailed analytics
- Larger minimap and quest interfaces

Desktop optimization leverages the additional screen real estate and input precision available on larger devices. The keyboard navigation system includes diagonal movement support (8-directional) with smooth interpolation between directions. Running mechanics multiply movement speed by 1.5x when modifier keys are held, with visual and audio feedback.

The audio control system provides granular volume adjustment with percentage displays, mute toggling, and expandable control panels. Desktop-specific UI elements include larger interactive areas, detailed tooltips, and keyboard shortcuts for power users.

---

## 🗄️ Database Design

### MongoDB Collections

#### User Collection
```javascript
{
  "_id": ObjectId,
  "username": "string",
  "password": "hashed_string",
  "email": "string"
}
```

#### Analytics Collection (trk)
```javascript
{
  "_id": ObjectId,
  "date": "YYYY-MM-DD",
  "uuid": "generated_user_id",
  "type": "view | interaction",
  "info": "interaction_details",
  "time": "seconds_spent",
  "page": "homepage | sandbox | story",
  "device": "desktop | mobile",
  "screenResolution": "1920x1080",
  "browser": "chrome | firefox | safari",
  "os": "windows | macos | linux"
}
```

### Database Indexes

The application creates optimized indexes for analytics queries:
- Date and type for general queries
- Unique user tracking
- Page time analysis
- Interaction analysis
- Device and browser analytics

The database design implements a sophisticated indexing strategy optimized for time-series analytics queries. Compound indexes combine frequently queried fields (date + type + page) to enable efficient data retrieval without full collection scans. The indexing strategy includes both ascending and descending orders to optimize different query patterns.

Unique user tracking leverages sparse indexes on UUID fields to minimize storage overhead while maintaining fast lookups. The time-series design partitions data by date ranges, enabling efficient aggregation pipelines that process months of data in milliseconds.

Special indexes support the analytics dashboard's real-time requirements - device and browser statistics use compound indexes on date+device+uuid to calculate unique users per device type without expensive distinct operations.

---

## 🐳 Deployment

### Docker Configuration

The application includes Docker configurations for easy deployment with multi-stage builds, environment configuration, volume management, and network configuration.

### Environment Management

Multiple deployment environments support the development lifecycle:
- **Local Development:** Hot reload and debugging tools for rapid development
- **Development Environment:** Shared environment for team collaboration
- **Staging Environment:** Production-like environment for final testing
- **Production Environment:** Optimized configuration for live deployment
- **Environment Parity:** Consistent configuration across all environments

---

## 🔮 Future Development

### In Progress
- **Story Mode chapters:** the Prologue is complete; Eikony and the following chapters are being written (the map shows a "work in progress" window for them)
- **Collectibles menu:** one place for every collectible found, points and scores per chapter

### Planned Features
- **Easter Eggs:** Tons of Easter Eggs.
- **Multilingual Support:** Internationalization for global accessibility
- **Enhanced Analytics:** Machine learning insights and predictive analytics
- **Social Features:** Career milestone sharing and visitor interaction
- **Linkedin API Integration**: Update career information with linkedin API

### Technical Roadmap
- **WebGL Rendering:** Hardware-accelerated graphics for better performance
- **Progressive Web App:** Offline functionality and app-like experience
- **Real-time Features:** Live visitor presence and collaborative exploration
- **AI Integration:** Personalized career recommendations and chatbot assistance
- **Advanced Analytics:** Heat mapping and advanced user behavior analysis

---

## ⚠️ Frontend Disclaimer

**Important Note:** I am primarily a **backend developer** with expertise in Java, Python, GO, and database systems. This project represents my journey into frontend development with React and TypeScript.
I already worked in React, but thats my first time in TypeScript.

While I've implemented all the interactive features and functionality you see, **some frontend practices may not follow industry best practices**. Areas that might not be optimal include:

- **CSS Architecture**: Styling may not follow advanced methodologies
- **React Patterns**: Component structure and state management could be more optimized
- **Performance Optimization**: Some frontend performance techniques might be missing
- **Accessibility**: ARIA labels and semantic HTML could be improved
- **Code Organization**: Frontend file structure and component organization may not follow React conventions

**This project is a learning experience** where I focused on creating a functional, engaging user experience rather than perfect frontend architecture. I'm actively working to improve my frontend skills and welcome any suggestions or contributions that follow React/TypeScript best practices.

**While my strengths are in backend development**—Go servers, MongoDB optimization, analytics aggregation, JWT authentication, and system architecture—the focus of this project was elsewhere.
---

## 🙏 Acknowledgments

### Special Thanks

🎨 **Huge appreciation to [@marguels](https://github.com/marguels)** for creating the animated character sprites that bring life to the game world! The walking animations and character design perfectly capture the retro aesthetic. Please give her some love and check out her github!

### Third-Party Assets and Libraries

- **RPGUI Framework:** Lightweight framework for old-school RPG GUI styling
- **Open Source Libraries:** Extensive use of React, Go, and MongoDB ecosystems

### AI-Generated Content & Tools

**Visual Assets:**
- **Midjourney (Paid Version):** Used for creating most sprites, buildings, backgrounds, and environmental elements
- **Sample Assets Folder:** Contains online samples for reference only - not used for commercial purposes and not owned by this project
- **Pixel Art Disclaimer:** While I'd love to create all pixel art by hand, time constraints and budget limitations made AI assistance necessary for the scope of this project.
- **Aseprite Software:** A proprietary, source-available image editor designed primarily for pixel art drawing and animation.
- **Claude.ai:** Assisted with some mathematical functions for player movement, collision detection algorithms, and hitbox calculations.

**Audio:**
- **Suno.com (Pro License):** AI-generated background music with proper copyright licensing for the immersive audio experience

### Asset Usage & Copyright

> 📝 **Important Note:** This project uses AI-generated assets under appropriate licenses and not for commercial uses. Sample folders contain reference materials found online ONLY FOR REFERENCE and not used in the final application. All commercial AI tools (Midjourney Pro, Suno Pro) were properly licensed during development.

### Design Inspiration
The project draws inspiration from classic RPG games while maintaining modern web standards and accessibility principles.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **CV:** https://api.retrojourney.dev/cv/download
- **LinkedIn:** https://www.linkedin.com/in/mauro-pezzati/
- **Email:** pezzati.mauro@gmail.com
- **GitHub:** https://github.com/SplinterPezz

---

<div align="left">

### *🚀 "Microservices master learning pixel art - because diverse skills make better developers.."*

**⭐ Don't forget to star this repository if you found it interesting!**

</div>