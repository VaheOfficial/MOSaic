#!/usr/bin/env bash
set -euo pipefail

# Bring up the stack in development mode with hot reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

