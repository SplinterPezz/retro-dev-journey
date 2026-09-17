#!/bin/bash

# Retro Dev Journey - Env Migration Script
# One-time conversion of a single-tenant backend .env file
# (PORT/ALLOW_ORIGIN/DB_NAME/JWT_SECRET/ROOT_*) to the multi-tenant format
# (TENANTS=id1,id2,... plus an <ID>_* block per tenant - see
# backend/internal/tenant), keeping the existing values for the site you
# already have running.
#
# Once a file is migrated, use ./add-tenant.sh to add further tenants to it -
# this script only handles the old -> new format conversion.
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

if grep -q "^TENANTS=" "$ENV_FILE"; then
    echo "ℹ️  $ENV_FILE already uses the multi-tenant format (TENANTS= found)."
    echo "   Nothing to migrate. Use ./add-tenant.sh to add a new tenant to it."
    exit 0
fi

if ! grep -q "^ALLOW_ORIGIN=" "$ENV_FILE"; then
    echo "❌ Couldn't find ALLOW_ORIGIN in $ENV_FILE - this doesn't look like"
    echo "   an old-format single-tenant env file. Aborting to be safe."
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

# Reads KEY=value (optionally quoted) from the target file
read_old_var() {
    local key="$1"
    grep -E "^${key}=" "$ENV_FILE" | head -n1 | sed -E "s/^${key}=//; s/^['\"]//; s/['\"]\$//"
}

# ---- backup -----------------------------------------------------------------

BACKUP_FILE="${ENV_FILE}.bak.$(date +%Y%m%d%H%M%S)"
cp "$ENV_FILE" "$BACKUP_FILE"
echo "💾 Backup saved to: $BACKUP_FILE"
echo ""

# ---- read old values ----------------------------------------------------

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

# ---- rewrite the file --------------------------------------------------

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
echo "   Original file backed up at: $BACKUP_FILE"
echo ""
echo "➡️  Run ./add-tenant.sh $ENV_FILE next if you want to add another site."
