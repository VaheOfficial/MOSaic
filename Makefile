SHELL := /bin/bash

.PHONY: up down logs seed fmt

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
