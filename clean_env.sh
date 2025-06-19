#!/bin/bash

# Retro Dev Journey - Cleanup Script
# This script removes all environment configuration files

echo "🧹 Retro Dev Journey - Environment Cleanup 🧹"
echo "=============================================="
echo ""

# Function to safely remove file if it exists
remove_file() {
    local file="$1"
    if [ -f "$file" ]; then
        rm "$file"
        echo "✅ Removed: $file"
        return 0
    else
        echo "ℹ️  Not found: $file"
        return 1
    fi
}

echo "🔍 Searching for environment files..."
echo ""

# Track removed files
removed_count=0

# Remove root .env file
if remove_file ".env"; then
    ((removed_count++))
fi

echo ""
echo "🔧 Backend environment files:"
# Remove backend .env files
if remove_file "backend/.env.local"; then
    ((removed_count++))
fi
if remove_file "backend/.env.dev"; then
    ((removed_count++))
fi
if remove_file "backend/.env.prod"; then
    ((removed_count++))
fi

echo ""
echo "🎨 Frontend environment files:"
# Remove frontend .env files
if remove_file "frontend/.env.local"; then
    ((removed_count++))
fi
if remove_file "frontend/.env.dev"; then
    ((removed_count++))
fi
if remove_file "frontend/.env.prod"; then
    ((removed_count++))
fi

echo ""
echo "📊 Cleanup Summary:"
echo "==================="
if [ $removed_count -eq 0 ]; then
    echo "🤷 No environment files found to remove."
    echo "   Your project is already clean!"
else
    echo "🗑️  Removed $removed_count environment file(s)."
    echo "   Your project has been cleaned up!"
fi

echo ""
echo "💡 To recreate the configuration, run:"
echo "   ./setup.sh (for interactive setup)"
echo "   ./setup-auto.sh (for automatic setup)"
echo "   ./setup-configure.sh (for manual configuration)"
echo ""
echo "✨ Cleanup completed!"