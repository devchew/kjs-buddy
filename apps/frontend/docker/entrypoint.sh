#!/bin/sh

# Recursively replace API URL token in all relevant files
echo "Replacing API URL tokens with: ${API_URL:-http://backend:3000}"

# Find and replace in all JavaScript, HTML, CSS, and JSON files
find /app -type f \( -name "*.js" -o -name "*.html" -o -name "*.css" -o -name "*.json" \) -exec sed -i "s|#{API_URL}#|${API_URL:-http://backend:3000}|g" {} \;

# Start nginx
exec "$@"
