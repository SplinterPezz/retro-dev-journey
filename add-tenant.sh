#!/bin/bash

# Retro Dev Journey - Add Tenant Script
# Adds one or more new tenants to an already multi-tenant backend env file
# (TENANTS=id1,id2,... plus an <ID>_* block per tenant - see
# backend/internal/tenant). If your env file still uses the old
# single-tenant format (PORT/ALLOW_ORIGIN/DB_NAME/JWT_SECRET/ROOT_*), run
# ./migrate-env-tenant.sh on it first - that's a one-time conversion, this
# script is the one you'll come back to every time you add a new site.
#
# Usage: ./add-tenant.sh [path-to-env-file]
#   Defaults to backend/.env.prod if no path is given.

set -e

ENV_FILE="${1:-backend/.env.prod}"

echo "➕ Retro Dev Journey - Add Tenant ➕"
echo "===================================="
echo ""

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ File not found: $ENV_FILE"
    echo "   Usage: ./add-tenant.sh [path-to-env-file]"
    exit 1
fi

if ! grep -q "^TENANTS=" "$ENV_FILE"; then
    echo "❌ $ENV_FILE doesn't look like it's in the multi-tenant format yet"
    echo "   (no TENANTS= line found). Run ./migrate-env-tenant.sh on it first."
    exit 1
fi

echo "📄 Target file: $ENV_FILE"
echo ""

# ---- helpers ----------------------------------------------------------------

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

read_password() {
    local prompt="$1"
    local variable_name="$2"

    echo -n "$prompt: "
    read -s user_input
    echo ""
    eval "$variable_name='$user_input'"
}

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

    get_random_chars() {
        if command -v openssl >/dev/null 2>&1; then
            openssl rand -base64 48 | tr -dc "$1" | head -c "$2"
        else
            LC_ALL=C tr -dc "$1" < /dev/urandom | head -c "$2"
        fi
    }

    password+=$(get_random_chars "$upper_chars" 1)
    password+=$(get_random_chars "$lower_chars" 1)
    password+=$(get_random_chars "$digits" 1)
    password+=$(get_random_chars "$all_chars" $((length - 3)))
    password=$(echo "$password" | fold -w1 | shuf | tr -d '\n')

    echo "$password"
}

read_env_var() {
    local key="$1"
    grep -E "^${key}=" "$ENV_FILE" | head -n1 | sed -E "s/^${key}=//; s/^['\"]//; s/['\"]\$//"
}

# ---- backup -------------------------------------------------------------

BACKUP_FILE="${ENV_FILE}.bak.$(date +%Y%m%d%H%M%S)"
cp "$ENV_FILE" "$BACKUP_FILE"
echo "💾 Backup saved to: $BACKUP_FILE"
echo ""
echo "Current tenants: $(read_env_var "TENANTS")"
echo ""

# ---- add tenants loop -----------------------------------------------------

ADDED_ANY=0

while true; do
    echo "🆕 New tenant configuration"
    echo "==========================="
    read_input "New tenant id (e.g. davide)" "" "NEW_ID"
    NEW_ID=$(echo "$NEW_ID" | tr -cd '[:alnum:]' | tr '[:upper:]' '[:lower:]')
    if [ -z "$NEW_ID" ]; then
        echo "❌ Tenant id can't be empty, skipping."
    elif grep -qi "^$(echo "$NEW_ID" | tr '[:lower:]' '[:upper:]')_ALLOW_ORIGIN=" "$ENV_FILE"; then
        echo "❌ Tenant '$NEW_ID' already exists in $ENV_FILE, skipping."
    else
        read_input "Frontend origin for this tenant (e.g. https://example.com or http://localhost:3001)" "" "NEW_ALLOW_ORIGIN"
        read_input "Database name" "retro_db_$NEW_ID" "NEW_DB_NAME"

        read_password "JWT secret (leave empty to auto-generate)" "NEW_JWT_SECRET"
        if [ -z "$NEW_JWT_SECRET" ]; then
            NEW_JWT_SECRET=$(generate_password 32)
            echo "   Generated JWT Secret: [HIDDEN]"
        fi

        read_input "Root username (leave empty to auto-generate)" "" "NEW_ROOT_USERNAME"
        if [ -z "$NEW_ROOT_USERNAME" ]; then
            NEW_ROOT_USERNAME=$(generate_password 12)
            echo "   Generated Root Username: $NEW_ROOT_USERNAME"
        fi

        read_password "Root password (leave empty to auto-generate)" "NEW_ROOT_PASSWORD"
        if [ -z "$NEW_ROOT_PASSWORD" ]; then
            NEW_ROOT_PASSWORD=$(generate_password 16)
            echo "   Generated Root Password: [HIDDEN]"
        else
            while ! [[ ${#NEW_ROOT_PASSWORD} -ge 8 && "$NEW_ROOT_PASSWORD" =~ [A-Z] && "$NEW_ROOT_PASSWORD" =~ [a-z] && "$NEW_ROOT_PASSWORD" =~ [0-9] && "$NEW_ROOT_PASSWORD" =~ ^[a-zA-Z0-9]+$ ]]; do
                echo "Invalid password. Must be 8+ chars with upper, lower and digit (no special chars)."
                read_password "Re-enter root password" "NEW_ROOT_PASSWORD"
            done
        fi

        read_input "Root email" "admin@$NEW_ID.example.com" "NEW_ROOT_EMAIL"
        read_input "CV filename" "cv.pdf" "NEW_CV_FILENAME"
        NEW_UPLOAD_DIR="./uploads/$NEW_ID"

        CURRENT_TENANTS=$(read_env_var "TENANTS")
        sed -i.bak "s/^TENANTS=.*/TENANTS=${CURRENT_TENANTS},${NEW_ID}/" "$ENV_FILE"
        rm -f "${ENV_FILE}.bak"

        NEW_PREFIX=$(echo "$NEW_ID" | tr '[:lower:]' '[:upper:]')
        {
            echo ""
            echo "${NEW_PREFIX}_ALLOW_ORIGIN='$NEW_ALLOW_ORIGIN'"
            echo "${NEW_PREFIX}_DB_NAME=$NEW_DB_NAME"
            echo "${NEW_PREFIX}_JWT_SECRET=$NEW_JWT_SECRET"
            echo "${NEW_PREFIX}_ROOT_USERNAME=$NEW_ROOT_USERNAME"
            echo "${NEW_PREFIX}_ROOT_PASSWORD=$NEW_ROOT_PASSWORD"
            echo "${NEW_PREFIX}_ROOT_EMAIL='$NEW_ROOT_EMAIL'"
            echo "${NEW_PREFIX}_UPLOAD_DIR=$NEW_UPLOAD_DIR"
            echo "${NEW_PREFIX}_CV_FILENAME=$NEW_CV_FILENAME"
        } >> "$ENV_FILE"

        mkdir -p "$(dirname "$ENV_FILE")/uploads/$NEW_ID"

        echo ""
        echo "✅ Added tenant '$NEW_ID' to $ENV_FILE"
        echo "   Root Username: $NEW_ROOT_USERNAME"
        echo "   Root Password: [HIDDEN]"
        ADDED_ANY=1
    fi

    echo ""
    read -p "➕ Add another tenant? (y/N): " add_more
    if [[ ! $add_more =~ ^[Yy]$ ]]; then
        break
    fi
    echo ""
done

echo ""
if [ "$ADDED_ANY" -eq 1 ]; then
    echo "🎉 Done. Restart the backend to pick up the new tenant(s) -"
    echo "   InitMongoDB() will create the database, indexes and root user"
    echo "   for any tenant it hasn't seen before, automatically."
else
    echo "ℹ️  No tenant was added."
fi
echo "   Original file backed up at: $BACKUP_FILE"
