#!/bin/sh

set -e

echo "🔧 Replacing environment variables in built files..."

replace_envs() {
  for VAR in $(env | awk -F= '{print $1}' | grep '^VITE_'); do
    VALUE=$(printenv "$VAR")
    [ -z "$VALUE" ] && continue  # skip empty values

    echo "📝 Replacing $VAR → $VALUE"

    # Escape special chars for sed
    ESCAPED_VALUE=$(printf '%s\n' "$VALUE" | sed 's/[\/&]/\\&/g')

    find "/app" -type f \
      \( -name '*.js' -o -name '*.html' -o -name '*.css' -o -name 'manifest.json' -o -name 'service-worker.js' -o -name '*.json' \) \
      -exec sed -i'' -e "s|$VAR|$ESCAPED_VALUE|g" '{}' +
  done

  echo "✅ Environment variables replaced successfully!"
}

replace_envs

exec serve -s /app -p 3000

echo "Starting server on port 3000"
