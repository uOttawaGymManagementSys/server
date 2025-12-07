# Terminal commands

> npm install
> ----
> nodemon main.js

# create a Local postgresSQL

1. Create local db called: gyminsight
2. create db schemas using the schema in data/schema.sql
3. import sample data from sample folder in: server/sample/
4. creat .env file

# .env file variables:

PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD='yourlocaldb password'
PG_PORT=5432
PG_DATABASE=gyminsight or your local db name

DEV_DATABASE_URL=your local database url
SERVER_PORT=3000

# Start server

[nodemon] starting `node main.js`
[dotenv@17.2.3] injecting env (10) from .env -- tip: 🛠️ run anywhere with `dotenvx run -- yourcommand`
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🗂️ backup and recover secrets: https://dotenvx.com/ops
Server running on port 3000
Connected to PostgreSQL
┌─────────────────────────
