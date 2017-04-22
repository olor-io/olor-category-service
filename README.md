# Olor-category-service

Backend API used to manage and send category icons to olor. Works mainly as
a relay backend service, sending data and icons to other microservices.

- [Developer documentation](#developer-documentation)
  - [Configure local environment](#configure-local-environment)
  - [Development](#delevopment)
  - [API docs](#api-docs)


# Developer documentation

## Configure local environment

Add environment variables to .env. Example config is found in .env-sample.

### Setup database

The application requires a PostgreSQL database to function.
While in project root, run `psql -f ./src/init-databas.sql` to create a new database.
Please make sure that you don't have database called categories on your system.

### Install npm modules

While in project root, run `npm install`.

## Development

During development you can use the `npm start` command to run the application.
The application uses the parameters provided in .env.

## API docs

URL | HTTP Verb | Action
--- | --------- | ------
/api/category | GET | All categories
/api/category/:id | GET | Category by a single Id
