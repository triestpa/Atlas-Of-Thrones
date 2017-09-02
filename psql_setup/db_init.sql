-- Reset DB
DROP DATABASE IF EXISTS atlas_of_thrones;
CREATE DATABASE atlas_of_thrones;

-- Connect to DB
\c atlas_of_thrones

-- Enable postgis
CREATE EXTENSION postgis;