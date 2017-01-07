# Community-app-category-service

Backend API used to manage and send category icons to community-app. Works mainly as
a relay backend service, sending data and icons to other microservices.

- [Development](#development)
  - [Running in development](#running-in-development)
  - [API docs](#api-docs)

# Development

The application requires a PostgreSQL database to function.
Run 'psql -f categories.sql' for new database.
Please make sure that you don't have database called categories in your system.

## Running in development

During development you can use the `npm start` command to run the
application through nodemon. Application use port 4000, and database use port 5432

## API docs

URL | HTTP Verb | Action
--- | --------- | ------
/api/category | GET | Every category IDs and links
/api/category/:id | GET | Category by single ID
