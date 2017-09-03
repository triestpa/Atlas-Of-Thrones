#!bin/bash
wget https://cdn.patricktriest.com/atlas-of-thrones/atlas_of_thrones.sql
psql -f db_init.sql
psql atlas_of_thrones < atlas_of_thrones.sql