psql -f db_init.sql
shp2pgsql -I -G -s 4326 shapefiles/kingdoms.shp kingdoms | psql -d atlas_of_thrones
shp2pgsql -I -G -s 4326 shapefiles/locations.shp locations | psql -d atlas_of_thrones
