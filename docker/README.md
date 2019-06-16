
# Atlas Of Thrones containerized - demo
- This is a demo and is not intended for production use and only as a demo on how to start contairizing your services.
- Services:
   - aot_frontend:\
![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/m3hran/aot_frontend.svg)
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/m3hran/aot_frontend.svg)
[![](https://images.microbadger.com/badges/image/m3hran/aot_frontend.svg)](https://microbadger.com/images/m3hran/aot_frontend)
   - aot_backend:\
![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/m3hran/aot_backend.svg)
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/m3hran/aot_backend.svg)
[![](https://images.microbadger.com/badges/image/m3hran/aot_backend.svg)](https://microbadger.com/images/m3hran/aot_backend)
   - aot_db:\
        image: mdillon/postgis

   - aot_cache:\
        image: redis

   - aot_adminer:\
        image: adminer

- How to run:

##
     git clone https://github.com/M3hran/Atlas-Of-Thrones.git && cd ./Atlas-Of-Thrones/docker && docker-compose up -d


## 
- read top level README for details on AOT project written by @tristpa
