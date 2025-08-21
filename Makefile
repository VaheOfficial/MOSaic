SHELL := /bin/bash

.PHONY: up down logs seed fmt dev dev-d

up:
	docker compose up --build -d

down:
	docker compose down -v

logs:
	docker compose logs -f --tail=100

seed:
	bash scripts/seed.sh

fmt:
	black backend/app || true
	npx prettier -w frontend || true

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

dev-d:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
