# MB backend challenge

Project is meant to measure applicant's skills of reading and writing code with a similar environment used at Mad Booster.

## About the challenge

This challenge is in shape of a small `Express` web server. Server contains information about companies, their customers and tasks. Your mission is to go through the project (`src/`), discover what the application does and implement tasks marked as `MB-TODO:` along the way.

Application has "session" which logs user in to a company. You can login to a company environment running [`./login.sh`](./login.sh) and changing the `companyId` in the payload.

> [!IMPORTANT]
> The code is not perfect! It contains common flaws and imperfections so do whatever you want with the code! Modify, remove, lint, expand, etc. to improve it 🚀.

We want to see how would you think and solve these kinds of problems. It is all up to you how you want to showcase your understanding of typescript, docker, REST APIs and skills of interpreting someone else's code.

Whenever you are ready let us know by sending the modified code e.g. via Github or what ever methods suits you and let's have a chat.

You can hit us up at kehitys@madbooster.com.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Compose plugin

## Running with Docker

### Start all services (Express + PostgreSQL)

```bash
docker compose up
```

The API will be available at `http://localhost:3100`.

### Stop services

```bash
docker compose down
```

### Stop and remove volumes (wipes database)

```bash
docker compose down -v
```

## Configuration

Environment variables are stored in `.env`.

| Variable            | Default                                      | Description              |
| ------------------- | -------------------------------------------- | ------------------------ |
| `PORT`              | `3100`                                       | Express server port      |
| `NODE_ENV`          | `development`                                | Node environment         |
| `DB_PORT  `         | `54321`                                      | Exposed db port          |
| `DB_URL  `          | `postgresql://postgres:postgres@db:5432/app` | DB url for application   |
| `POSTGRES_USER`     | `postgres`                                   | PostgreSQL username      |
| `POSTGRES_PASSWORD` | `postgres`                                   | PostgreSQL password      |
| `POSTGRES_DB`       | `app`                                        | PostgreSQL database name |

## Tips

> [!NOTE]
> Run these commands on host machine

Access database: `npm run db:open`

Create new migration file: `npm run db:generate -- <name>`

Apply migrations: `npm run db:migrate`

Drop migrations: `npm run db:drop`

*ps. If you have suggestions how to improve this project, leave a pull request*
