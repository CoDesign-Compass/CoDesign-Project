## Backend DB Quick Start

1. Install Docker Desktop
2. In the project root directory, copy the configuration file:
    - cp .env.example .env
3. Start the database:
    - docker compose up --build -d
4. Check if it's running:
    - docker ps
5. Stop the database:
    - docker compose down
6. OpenAPI(Swagger): http://localhost:8080/swagger-ui/index.html