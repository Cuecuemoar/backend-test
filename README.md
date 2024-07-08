# Installation

## Docker

To set up the environment, you will need to first install [Docker](https://docs.docker.com/engine/install/).
This test uses Docker Compose to run everything.

## Backend Server

The backend server uses Node.js, but you don't need to have that installed on your machine. You can install
the dependencies by running:

```bash
docker compose run server npm i
```

## Database

To bring up the database:

```bash
docker compose up -d db
```

Once it's ready to go, you can run the schema migrator to build the schema:

```bash
docker compose run migrate
```

If that fails (because of something like an already existing table), you can always start with a clean slate
by bringing the DB container down:

```bash
docker compose down
```

## Utilities

To seed the database or run tests, first execute the following command:

```bash
CONTAINER=$(docker ps | grep 'backend-test-server' | awk '{print $1}')
```

Then run this command to seed the tables with random fake data:

```bash
docker exec "$CONTAINER" node ./database/seeder.js
```

If you want to run the test suite, execute the following command:

```bash
docker exec "$CONTAINER" npm test
```

## Usage

The service should be available at localhost:3000. If it's still not available, try forcing an ad hoc port mapping with:
```bash
 docker compose run -p 3000:3000 server
```

### Endpoints
### Get Labor Costs by Worker

**Description**: Returns labor costs by worker. The results can be filtered by location ID, one or more worker IDs, or 
completion status of tasks.

**URL**: /labor-costs/workers

**Method**: GET

**Query Parameters**:

`worker_ids` (optional): A comma-separated list of worker IDs to filter by. If not provided, all workers will be included. 

`location_id` (optional): A single location ID to filter by. If not provided, all locations will be included.

`task_status` (optional): A completion value of tasks to filter by. Acceptable values are `complete` and `incomplete` 
If not provided, all tasks will be included.

**Responses**

`200 OK`
A JSON array containing the labor costs by worker

```json
[
    {
        "username": "Blake_Harber41",
        "total_cost": 123.45
    }
]
```

`400 Bad Request`

If the `worker_ids` or `location_id` are not valid integers or if `task_status` is invalid.
```json
{
  "errors": [
    {
      "type": "field",
      "value": "1,2,3abc",
      "msg": "worker_ids must be an integer or a comma-separated list of integers greater than 0",
      "path": "worker_ids",
      "location": "query"
    }
  ]
}
```

`500 Bad Request`

500 Internal Server Error: If an error occurs while processing the request.

```json
{
  "error": "A server error has occurred"
}
```

### Get Labor Costs by Location

**Description**: Returns labor costs by location. The results can be filtered by location ID, one or more worker IDs, or
completion status of tasks.

**URL**: /labor-costs/locations

**Method**: GET

**Query Parameters**:

`worker_ids` (optional): A comma-separated list of worker IDs to filter by. If not provided, all workers will be included.

`location_id` (optional): A single location ID to filter by. If not provided, all locations will be included.

`task_status` (optional): A completion value of tasks to filter by. Acceptable values are `complete` and `incomplete` 
If not provided, all tasks will be included.

**Responses**

`200 OK`
A JSON array containing the labor costs by worker

```json
[
  {
    "name": "Marianborough",
    "total_cost": "728.59"
  }
]
```

`400 Bad Request`

If the `worker_ids` or `location_id` are not valid integers or if `task_status` is invalid.
```json
{
  "errors": [
    {
      "type": "field",
      "value": "finished",
      "msg": "task_status must be one of: complete, incomplete",
      "path": "task_status",
      "location": "query"
    }
  ]
}
```

`500 Bad Request`

500 Internal Server Error: If an error occurs while processing the request.

```json
{
  "error": "A server error has occurred"
}
```