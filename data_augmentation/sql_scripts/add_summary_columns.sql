-- Connect to DB
\c got_map

-- Add summary columns
ALTER TABLE political ADD COLUMN summary TEXT;
ALTER TABLE political ADD COLUMN url TEXT;
ALTER TABLE locations ADD COLUMN summary TEXT;
ALTER TABLE locations ADD COLUMN url TEXT;
