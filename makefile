install:
	docker compose run app-ddd npm install

run:
	docker compose down
	docker compose up -d

test:
	docker compose run app-ddd npm run test

test-filter:
	docker compose run app-ddd npm run test ${CMD}

bash:
	docker compose exec app-ddd bash