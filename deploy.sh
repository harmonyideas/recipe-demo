#!/usr/bin/env bash
# Build and (re)start the recipe demo in Docker.
#   ./deploy.sh            pull the latest code, rebuild, restart
#   ./deploy.sh --no-pull  rebuild and restart without pulling
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example. Put your Supabase URL and anon key in it, then run ./deploy.sh again."
  exit 1
fi

if grep -q 'your-project-ref\|your-anon-key' .env; then
  echo ".env still has the example values. Edit it with your Supabase URL and anon key first."
  exit 1
fi

if [ "${1:-}" != "--no-pull" ] && [ -d .git ]; then
  git pull --ff-only
fi

docker compose up -d --build --remove-orphans
docker image prune -f >/dev/null

echo "Waiting for the app to start..."
for _ in $(seq 1 30); do
  status=$(docker inspect -f '{{.State.Health.Status}}' recipe-demo 2>/dev/null || echo starting)
  if [ "$status" = "healthy" ]; then
    port=$(grep -E '^APP_PORT=' .env | cut -d= -f2); port=${port:-3000}
    echo "recipe-demo is running on port ${port}."
    exit 0
  fi
  sleep 2
done

echo "The app did not report healthy within a minute. Recent logs:"
docker compose logs --tail 40 recipe-demo
exit 1
