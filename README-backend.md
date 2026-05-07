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

## SMTP Email Configuration

Email sending now uses SMTP. Configure these environment variables for the backend:

- `SPRING_MAIL_HOST`
- `SPRING_MAIL_PORT` (default: `587`)
- `SPRING_MAIL_USERNAME`
- `SPRING_MAIL_PASSWORD`
- `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH` (default: `true`)
- `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE` (default: `true`)
- `APP_MAIL_FROM`

The backend also accepts the shorter `SMTP_*` variables for compatibility.
