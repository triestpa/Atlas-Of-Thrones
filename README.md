# Atlas-Of-Thrones

An interactive "Game of Thrones" map powered by Leaflet, PostGIS, and Redis.

#### Structure
- `app/` - The front-end web application source.
- `public/` - The compiled and minified front-end code.
- `server/` - The Node.js API server code.
- `setup/` - A collection of scripts to download the shapefiles and setup the postgresql database.

#### Setup

To setup the project, simply download or clone the project to your local machine and `npm install`.

The only extra step is adding a `.env` file in order to properly initialize the required environment variables.

Here's an example `.env` file with sensible defaults for local development -
```
PORT=5000
DATABASE_URL=postgres://username@localhost:5432/got_map
POSTGRES_SSL=false
REDIS_URL=localhost
CORS_ORIGIN=http://localhost:8080
```

Run `npm run local` to start the API server on `localhost:5000`, and to build/watch/serve the frontend code from `localhost:8080`.