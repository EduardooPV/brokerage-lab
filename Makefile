.PHONY: dev stop infra infra-reset

infra:
	docker compose up -d

infra-reset:
	docker compose down -v
	docker compose up -d

dev: infra
	pkill -f "dotne[t] watch" || true
	pkill -f "CorretoraAp[i]" || true
	pkill -f "npm[ ]run[ ]start:dev" || true
	fuser -k 5089/tcp || true
	sleep 5
	cd api/CorretoraApi && dotnet watch run &
	cd bff && npm run start:dev &
	cd web && npm run dev; $(MAKE) stop

stop:
	pkill -f "dotne[t] watch" || true
	pkill -f "CorretoraAp[i]" || true
	pkill -f "npm[ ]run[ ]start:dev" || true
	pkill -f "npm[ ]run[ ]dev" || true
	fuser -k 5089/tcp || true
	docker compose stop