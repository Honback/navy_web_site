#!/bin/bash
# Navy Communication DB Migration Runner
# Usage: ./db/migrate.sh
#
# Applies pending migration files from db/migrations/ to the running PostgreSQL.
# Tracks applied migrations in a schema_migrations table.
# Safe to run multiple times - already applied migrations are skipped.

set -e

CONTAINER="navy-postgres"
DB="navy_communication"
USER="navy_admin"
MIGRATIONS_DIR="$(cd "$(dirname "$0")/migrations" && pwd)"

# Check if postgres container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  echo "Error: ${CONTAINER} container is not running."
  echo "Start it with: docker compose up -d"
  exit 1
fi

# Create migrations tracking table if not exists
docker exec -i "$CONTAINER" psql -U "$USER" -d "$DB" -q <<'SQL'
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(100) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SQL

echo "=== DB Migration Runner ==="
echo ""

APPLIED=0
SKIPPED=0

# Apply each migration file in order
for file in "$MIGRATIONS_DIR"/*.sql; do
  [ -f "$file" ] || continue

  VERSION=$(basename "$file")

  # Check if already applied
  ALREADY=$(docker exec -i "$CONTAINER" psql -U "$USER" -d "$DB" -tAc \
    "SELECT COUNT(*) FROM schema_migrations WHERE version = '${VERSION}'")

  if [ "$ALREADY" -gt 0 ]; then
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  echo "Applying: ${VERSION}"
  docker exec -i "$CONTAINER" psql -U "$USER" -d "$DB" -q < "$file"

  docker exec -i "$CONTAINER" psql -U "$USER" -d "$DB" -q -c \
    "INSERT INTO schema_migrations (version) VALUES ('${VERSION}')"

  APPLIED=$((APPLIED + 1))
  echo "  Done."
done

echo ""
echo "Applied: ${APPLIED}, Skipped (already applied): ${SKIPPED}"
echo "=== Migration complete ==="
