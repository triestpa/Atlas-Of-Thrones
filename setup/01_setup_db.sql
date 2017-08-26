-- Reset DB
DROP DATABASE IF EXISTS got_map;
CREATE DATABASE got_map;

-- Connect to DB
\c got_map

-- Enable postgis
CREATE EXTENSION postgis;