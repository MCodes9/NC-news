# Northcoders News API

## Background

I am building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which will provide this information to the front end architecture.

## Kanban:

The Trello Board for this project can be found: https://trello.com/b/7yiHe1nI

## Developer information

The database is PSQL and interacts with it using node-postgres.

After pulling this repo, in order to connect to the two databases locally, you will need to create two .env files: .env.test and .env.development. Use the following commands in the root directory:

In .env.development, type
echo 'PGDATABASE=nc_news'

In .env.test, type
echo 'PGDATABASE=nc_news_test'

These will automatically be ignored in the .gitignore file.
