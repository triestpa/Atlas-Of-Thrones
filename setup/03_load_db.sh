#!bin/bash
shp2pgsql -I -G -s 4326 ./data/GISofThrones/GoTRelease/Continents.shp continents | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/GISofThrones/GoTRelease/Islands.shp islands | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/GISofThrones/GoTRelease/Lakes.shp lakes | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/GISofThrones/GoTRelease/Land.shp land | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/GISofThrones/GoTRelease/Landscape.shp landscape | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/GISofThrones/GoTRelease/Locations.shp locations | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/GISofThrones/GoTRelease/Political.shp political | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/GISofThrones/GoTRelease/Regions.shp regions | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/GISofThrones/GoTRelease/Rivers.shp rivers | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/GISofThrones/GoTRelease/Roads.shp roads | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/GISofThrones/GoTRelease/Wall.shp wall | psql -d got_map