
# Atlas Of Thrones Microservice - POC
- This is a POC and is not intended for production use and only as a demo on how to start contairizing your services.
- Services:
   - aot_frontend:\
![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/m3hran/aot_frontend.svg)
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/m3hran/aot_frontend.svg)
[![](https://images.microbadger.com/badges/image/m3hran/aot_frontend.svg)](https://microbadger.com/images/m3hran/aot_frontend)
![Docker Pulls](https://img.shields.io/docker/pulls/m3hran/aot_frontend.svg)
   - aot_backend:\
![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/m3hran/aot_backend.svg)
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/m3hran/aot_backend.svg)
[![](https://images.microbadger.com/badges/image/m3hran/aot_backend.svg)](https://microbadger.com/images/m3hran/aot_backend)
![Docker Pulls](https://img.shields.io/docker/pulls/m3hran/aot_backend.svg)
   - aot_db:\
![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/mdillon/postgis.svg)
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/mdillon/postgis.svg)
![Docker Pulls](https://img.shields.io/docker/pulls/mdillon/postgis.svg)

   - aot_cache:\
        image: redis
![Docker Pulls](https://img.shields.io/docker/pulls/_/redis.svg)

   - aot_adminer:\
        image: adminer
![Docker Pulls](https://img.shields.io/docker/pulls/_/adminer.svg)

- How to run:

##
     git clone https://github.com/M3hran/Atlas-Of-Thrones.git && cd ./Atlas-Of-Thrones/docker && docker-compose up -d
## 

- How to Access:
  After the stack is deployed using the docker-compose file 
    - Web UI will be listening at:  
      
         http://localhost:8080
      ##
    - GeoSpatial API will be serving GeoJSON objects at:
      
         http://localhost:5000/kingdoms
      ##
    - Included there is also a Web UI to interface with the DB at:
      
         http://localhost:8081
      ##

- Read top level README for details on AOT project written by [@Patrick Triest]( https://github.com/triestpa )

