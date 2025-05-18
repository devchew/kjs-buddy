#!/bin/bash

# build-prod-local.sh
# Script to build the project for local production

echo "Removing ./dist directory..."
rm -rf ./dist

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Building all packages..."
pnpm build

echo "Deploying backend..."
pnpm deploy --filter=./apps/backend --prod ./dist/backend

echo "Deploying frontend..."
pnpm deploy --filter=./apps/frontend --prod ./dist/frontend

echo "Deploying admin..."
pnpm deploy --filter=./apps/admin --prod ./dist/admin

echo "Starting the application with docker compose..."
docker compose up --build --force-recreate --remove-orphans -d

# on exit compose down
trap 'docker compose down' EXIT
echo "Application started. Press Ctrl+C to stop."
# Wait for the user to press Ctrl+C
while true; do
    sleep 1
done


