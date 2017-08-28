#!bin/bash
shp2pgsql -I -G -s 4326 ./data/game_of_thrones_shapes/Continents.shp continents | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/game_of_thrones_shapes/Islands.shp islands | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/game_of_thrones_shapes/Lakes.shp lakes | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/game_of_thrones_shapes/Land.shp land | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/game_of_thrones_shapes/Landscape.shp landscape | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/game_of_thrones_shapes/Locations.shp locations | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/game_of_thrones_shapes/Political.shp political | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/game_of_thrones_shapes/Regions.shp regions | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/game_of_thrones_shapes/Rivers.shp rivers | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/game_of_thrones_shapes/Roads.shp roads | psql -d got_map
shp2pgsql -I -G -s 4326 ./data/game_of_thrones_shapes/Wall.shp wall | psql -d got_map