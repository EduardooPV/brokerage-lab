.PHONY: dev stop infra

infra:
	docker compose up -d

dev: infra
	cd api/CorretoraApi && dotnet watch run &
	cd bff && npm run start:dev &
	cd web && npm run dev; $(MAKE) stop

stop:
	pkill -f "dotnet watch" || true
	pkill -f "dotnet run" || true
	pkill -f "npm run start:dev" || true
	pkill -f "npm run dev" || true