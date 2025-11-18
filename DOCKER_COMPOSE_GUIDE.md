# Docker Compose Setup Guide

This guide explains how to run the entire IoT Event Processing system using Docker Compose instead of Kubernetes/Skaffold.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (comes with Docker Desktop)
- Node.js installed (for building shared package if needed)

## About the .env File

The `.env` file is **optional**. All environment variables are already configured directly in `docker-compose.yml`, so the system will work without it. However, if you want to customize settings (like changing ports or credentials), you can:

1. Create or edit the `.env` file in the project root
2. Docker Compose will automatically load variables from `.env`
3. Reference them in `docker-compose.yml` using `${VARIABLE_NAME}` syntax

See the **[Environment Variables](#environment-variables)** section for customization options.

## Quick Start

### 1. Start All Services

From the project root directory, run:

```bash
docker-compose up --build
```

This command will:
- Build the Docker images for Process and Agent services
- Start all services including Zookeeper, Kafka, MongoDB, Redis, Process, and two Agent instances
- Wait for health checks before starting dependent services

### 2. Access the API

The Process service API is available at:

```
http://localhost:3000
```

**Available Endpoints:**
- Events: `http://localhost:3000/events`
- Rules: `http://localhost:3000/rules`
- Health: `http://localhost:3000/health`

### 3. Stop All Services

```bash
docker-compose down
```

To also remove volumes (data will be lost):

```bash
docker-compose down -v
```

## Port Mappings

| Service | Port | URL |
|---------|------|-----|
| Zookeeper | 2181 | localhost:2181 |
| Kafka | 9092 (internal), 29092 (external) | localhost:29092 |
| MongoDB | 27017 | localhost:27017 |
| Redis | 6379 | localhost:6379 |
| Process Service | 3000 | http://localhost:3000 |
| Agent 1 | (internal) | - |
| Agent 2 | (internal) | - |

## Environment Variables (Optional)

You can customize the setup by creating a `.env` file in the project root and adding any of these variables:

```env
# Ports (default values)
ZOOKEEPER_PORT=2181
KAFKA_INTERNAL_PORT=9092
KAFKA_EXTERNAL_PORT=29092
MONGODB_PORT=27017
REDIS_PORT=6379
PROCESS_SERVICE_PORT=3000

# MongoDB connection
MONGO_URL=mongodb://mongodb:27017
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password

# Redis connection
REDIS_URI=redis://redis:6379

# Kafka configuration
KAFKA_TOPIC=agent-events
KAFKA_BROKER_URI=kafka:9092

# Service configuration
PROCESS_SERVICE_PORT=3000
AGENT_1_PORT=3001
AGENT_2_PORT=3002
```

After creating `.env`, restart the containers for changes to take effect:
```bash
docker-compose down
docker-compose up
```

## Service Details

### Zookeeper
- Manages Kafka cluster coordination
- Port: 2181

### Kafka
- Message broker for event streaming
- Port: 9092 (internal), 29092 (external for localhost access)
- Topic: `agent-events`

### MongoDB
- Stores events and rules
- Default credentials: admin / password
- Port: 27017

### Redis
- Caches rules for fast lookups
- Port: 6379

### Process Service
- Consumes events from Kafka
- Matches events against rules
- Exposes REST API
- Port: 3000

### Agent Services
- Agent 1: Sends events with AGENT_ID=1
- Agent 2: Sends events with AGENT_ID=2
- Both continuously generate random sensor events

## Development Workflow

### Viewing Logs

See logs for a specific service:
```bash
docker-compose logs -f process
```

Follow logs for all services:
```bash
docker-compose logs -f
```

### Rebuilding Services

Rebuild and restart a specific service:
```bash
docker-compose up --build process
```

### Database Access

**Connect to MongoDB:**
```bash
docker exec -it part-mongodb mongosh -u admin -p password
```

**Connect to Redis:**
```bash
docker exec -it part-redis redis-cli
```

**Connect to Kafka:**
```bash
docker exec -it part-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic agent-events --from-beginning
```

## Using Postman

Import the `part-task.postman_collection.json` file into Postman and update the base URL to:
```
http://localhost:3000
```

All endpoints will now work with the Docker Compose setup.

## Troubleshooting

### Services not starting?
Check the logs:
```bash
docker-compose logs
```

### Port already in use?
Change the port mapping in `docker-compose.yml`. For example, to use port 3001 for Process:
```yaml
ports:
  - "3001:3000"
```

### MongoDB connection errors?
Ensure MongoDB health check passes:
```bash
docker-compose ps
```

### Kafka not connecting?
Ensure the broker is healthy:
```bash
docker-compose logs kafka
```

## Performance Optimization

For production-like performance:

1. Increase container resources by adding to `docker-compose.yml`:
```yaml
services:
  process:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

2. Run without rebuilding on subsequent starts:
```bash
docker-compose up
```

3. Run in detached mode:
```bash
docker-compose up -d
```

## Next Steps

- Test the API using Postman collection
- Monitor logs for event processing
- Add more agent instances by copying the agent service definition
- Modify environment variables in `.env` file as needed
