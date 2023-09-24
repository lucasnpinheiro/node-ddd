## Curso DDD Full Cycle

### Start project

```shell

docker compose up -d --build

docker compose run app-ddd npm install

```

### Run test project

```shell

docker compose run app-ddd npm run test

```

## Using make

### Start project

```shell

make install

```

### Run test project

```shell

make test

```

### Run specific test project

```shell

make test-filter CMD=src/infrastructure/order/repository/sequilize/order.repository.spec.ts

```
