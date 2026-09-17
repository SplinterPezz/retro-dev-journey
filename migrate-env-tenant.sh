#!/bin/bash

# Retro Dev Journey - Env Migration Script
# Migrates a single-tenant backend .env file (PORT/ALLOW_ORIGIN/DB_NAME/
# JWT_SECRET/ROOT_*) to the multi-tenant format (TENANTS=id1,id2,... plus an
# <ID>_* block per tenant - see backend/internal/tenant), keeping the
# existing values for the site you already have running. Then optionally
# walks you through adding one or more new tenants to the same file.
#
# Usage: ./migrate-env-tenant.sh [path-to-env-file]
#   Defaults to backend/.env.prod if no path is given.

set -e

ENV_FILE="${1:-backend/.env.prod}"

echo "🔀 Retro Dev Journey - Env Tenant Migration 🔀"
echo "==============================================="
echo ""

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ File not found: $ENV_FILE"
    echo "   Usage: ./migrate-env-tenant.sh [path-to-env-file]"
    exit 1
fi

echo "📄 Target file: $ENV_FILE"
echo ""

# ---- helpers (same as setup-configure.sh) ----------------------------------

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

# Reads KEY=value (optionally quoted) from the target file
read_old_var() {
    local key="$1"
    grep -E "^${key}=" "$ENV_FILE" | head -n1 | sed -E "s/^${key}=//; s/^['\"]//; s/['\"]\$//"
}

# ---- 1. detect current format ----------------------------------------------

if grep -q "^TENANTS=" "$ENV_FILE"; then
    echo "ℹ️  This file already uses the multi-tenant format (TENANTS= found)."
    echo "   Skipping migration, jumping straight to 'add a tenant'."
    echo ""
    SKIP_MIGRATION=1
else
    if ! grep -q "^ALLOW_ORIGIN=" "$ENV_FILE"; then
        echo "❌ Couldn't find ALLOW_ORIGIN in $ENV_FILE - this doesn't look like"
        echo "   an old-format single-tenant env file. Aborting to be safe."
        exit 1
    fi
    SKIP_MIGRATION=0
fi

# ---- 2. backup --------------------------------------------------------------

BACKUP_FILE="${ENV_FILE}.bak.$(date +%Y%m%d%H%M%S)"
cp "$ENV_FILE" "$BACKUP_FILE"
echo "💾 Backup saved to: $BACKUP_FILE"
echo ""

if [ "$SKIP_MIGRATION" -eq 0 ]; then
    # ---- 3. read old values -------------------------------------------------
    OLD_PORT=$(read_old_var "PORT")
    OLD_ALLOW_ORIGIN=$(read_old_var "ALLOW_ORIGIN")
    OLD_MONGO_URI=$(read_old_var "MONGO_URI")
    OLD_MONGO_USERNAME=$(read_old_var "MONGO_USERNAME")
    OLD_MONGO_PASSWORD=$(read_old_var "MONGO_PASSWORD")
    OLD_DB_NAME=$(read_old_var "DB_NAME")
    OLD_JWT_SECRET=$(read_old_var "JWT_SECRET")
    OLD_ROOT_USERNAME=$(read_old_var "ROOT_USERNAME")
    OLD_ROOT_PASSWORD=$(read_old_var "ROOT_PASSWORD")
    OLD_ROOT_EMAIL=$(read_old_var "ROOT_EMAIL")

    echo "🔎 Found existing single-tenant configuration:"
    echo "   - ALLOW_ORIGIN: $OLD_ALLOW_ORIGIN"
    echo "   - DB_NAME: $OLD_DB_NAME"
    echo "   - ROOT_USERNAME: $OLD_ROOT_USERNAME"
    echo ""

    # Guess a tenant id from the domain (first label, alnum only) as a default
    GUESSED_ID=$(echo "$OLD_ALLOW_ORIGIN" | sed -E 's#^https?://##; s#^www\.##' | cut -d'.' -f1 | tr -cd '[:alnum:]' | tr '[:upper:]' '[:lower:]')
    read_input "Tenant id for your existing site" "$GUESSED_ID" "EXISTING_ID"
    EXISTING_ID=$(echo "$EXISTING_ID" | tr -cd '[:alnum:]' | tr '[:upper:]' '[:lower:]')
    if [ -z "$EXISTING_ID" ]; then
        echo "❌ Tenant id can't be empty."
        exit 1
    fi

    # Detect an existing flat-structure uploaded CV (old code stored it directly
    # under backend/uploads/, new code expects backend/uploads/<tenant>/)
    UPLOAD_ROOT="$(dirname "$ENV_FILE")/uploads"
    OLD_CV_PATH=""
    if [ -d "$UPLOAD_ROOT" ]; then
        OLD_CV_PATH=$(find "$UPLOAD_ROOT" -maxdepth 1 -type f -iname "*.pdf" | head -n1)
    fi

    if [ -n "$OLD_CV_PATH" ]; then
        EXISTING_CV_FILENAME=$(basename "$OLD_CV_PATH")
        echo "📄 Found existing uploaded CV: $OLD_CV_PATH"
    else
        read_input "CV filename for this tenant" "cv.pdf" "EXISTING_CV_FILENAME"
    fi

    EXISTING_UPLOAD_DIR="./uploads/$EXISTING_ID"

    # ---- 4. rewrite the file --------------------------------------------------
    {
        echo "PORT=$OLD_PORT"
        echo ""
        echo "MONGO_URI='$OLD_MONGO_URI'"
        echo "MONGO_USERNAME=$OLD_MONGO_USERNAME"
        echo "MONGO_PASSWORD=$OLD_MONGO_PASSWORD"
        echo ""
        echo "# Comma-separated list of tenant ids. Each tenant needs its own"
        echo "# <ID>_ALLOW_ORIGIN / <ID>_DB_NAME / <ID>_JWT_SECRET / <ID>_ROOT_* /"
        echo "# <ID>_UPLOAD_DIR / <ID>_CV_FILENAME block below (see internal/tenant)."
        echo "TENANTS=$EXISTING_ID"
        echo ""
        PREFIX=$(echo "$EXISTING_ID" | tr '[:lower:]' '[:upper:]')
        echo "${PREFIX}_ALLOW_ORIGIN='$OLD_ALLOW_ORIGIN'"
        echo "${PREFIX}_DB_NAME=$OLD_DB_NAME"
        echo "${PREFIX}_JWT_SECRET=$OLD_JWT_SECRET"
        echo "${PREFIX}_ROOT_USERNAME=$OLD_ROOT_USERNAME"
        echo "${PREFIX}_ROOT_PASSWORD=$OLD_ROOT_PASSWORD"
        echo "${PREFIX}_ROOT_EMAIL='$OLD_ROOT_EMAIL'"
        echo "${PREFIX}_UPLOAD_DIR=$EXISTING_UPLOAD_DIR"
        echo "${PREFIX}_CV_FILENAME=$EXISTING_CV_FILENAME"
    } > "$ENV_FILE"

    if [ -n "$OLD_CV_PATH" ]; then
        mkdir -p "$UPLOAD_ROOT/$EXISTING_ID"
        mv "$OLD_CV_PATH" "$UPLOAD_ROOT/$EXISTING_ID/$EXISTING_CV_FILENAME"
        echo "📦 Moved CV to: $UPLOAD_ROOT/$EXISTING_ID/$EXISTING_CV_FILENAME"
    fi

    echo ""
    echo "✅ Migrated $ENV_FILE to the multi-tenant format (tenant: $EXISTING_ID)."
    echo ""
else
    EXISTING_ID=""
fi

# ---- 5. optionally add new tenants -----------------------------------------

while true; do
    read -p "➕ Do you want to add a new tenant to this file now? (y/N): " add_more
    if [[ ! $add_more =~ ^[Yy]$ ]]; then
        break
    fi

    echo ""
    echo "🆕 New tenant configuration"
    echo "==========================="
    read_input "New tenant id (e.g. davide)" "" "NEW_ID"
    NEW_ID=$(echo "$NEW_ID" | tr -cd '[:alnum:]' | tr '[:upper:]' '[:lower:]')
    if [ -z "$NEW_ID" ]; then
        echo "❌ Tenant id can't be empty, skipping."
        continue
    fi
    if grep -qi "^${NEW_ID^^}_ALLOW_ORIGIN=" "$ENV_FILE"; then
        echo "❌ Tenant '$NEW_ID' already exists in $ENV_FILE, skipping."
        continue
    fi

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

    # Append to TENANTS list
    CURRENT_TENANTS=$(read_old_var "TENANTS")
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
    echo ""
done

echo ""
echo "🎉 Done. Restart the backend to pick up the new configuration -"
echo "   InitMongoDB() will create the database, indexes and root user"
echo "   for any tenant it hasn't seen before, automatically."
echo "   Original file backed up at: $BACKUP_FILE"
