#!/bin/sh

# Recursively replace API URL token in all relevant files
echo "Replacing APP URL tokens with: ${MAIN_APP_URL:-http://backend:3000}"

# Find and replace in all JavaScript, HTML, CSS, and JSON files
find /app -type f \( -name "*.js" -o -name "*.html" -o -name "*.css" -o -name "*.json" \) -exec sed -i "s|#{MAIN_APP_URL}#|${MAIN_APP_URL:-http://backend:3000}|g" {} \;

# Start nginx
exec "$@"
