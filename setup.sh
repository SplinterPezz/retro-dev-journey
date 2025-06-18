#!/bin/bash

# Retro Dev Journey - Main Setup Script
# Choose between auto setup or manual configuration

set -e

echo "🎮 Welcome to Retro Dev Journey Setup 🎮"
echo "========================================"
echo ""
echo "This setup will create all the .env files required"
echo ""
echo "Please choose your setup method:"
echo ""
echo "1) Auto Setup (Recommended)"
echo "   - Quick setup with auto-generated values"
echo "   - Uses default domains (retrojourney.dev) for production"
echo "   - No user input required"
echo ""
echo "2) Configure (Manual)"
echo "   - Custom configuration"
echo "   - Set your own domains and credentials"
echo "   - Guided step-by-step process"
echo ""

while true; do
    read -p "Enter your choice (1 for auto, 2 for configure): " choice
    case $choice in
        1|auto)
            echo ""
            echo "🚀 Starting auto setup..."
            chmod +x setup-auto.sh
            ./setup-auto.sh
            break
            ;;
        2|configure)
            echo ""
            echo "🔧 Starting manual configuration..."
            chmod +x setup-configure.sh
            ./setup-configure.sh
            break
            ;;
        *)
            echo "❌ Invalid choice. Please enter 1 or 2."
            ;;
    esac
done

echo ""
echo "🎉 Setup completed! Your Retro Dev Journey is ready to begin!"