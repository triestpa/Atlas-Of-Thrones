
# Atlas Of Thrones containerized - demo
- This is a demo and is not intended for production use and only as a demo on how to start contairizing your services.
- Services:
   - aot_frontend:
[![Docker Automated build](https://img.shields.io/docker/automated/m3hran/aot_frontend.svg?style=flat-square)]()
[![Docker Build Status](https://img.shields.io/docker/build/m3hran/aot_frontend.svg?style=flat-square)]()
[![](https://images.microbadger.com/badges/image/m3hran/aot_frontend.svg)](https://microbadger.com/images/m3hran/aot_frontend)
   - aot_backend:
[![Docker Automated build](https://img.shields.io/docker/automated/m3hran/aot_backend.svg?style=flat-square)]()
[![Docker Build Status](https://img.shields.io/docker/build/m3hran/aot_backend.svg?style=flat-square)]()
[![](https://images.microbadger.com/badges/image/m3hran/aot_backend.svg)](https://microbadger.com/images/m3hran/aot_backend)
   - aot_db:
        image: mdillon/postgis

   - aot_cache:
        image: redis

   - aot_adminer:
        image: adminer

- How to run:

##
     git clone https://github.com/M3hran/Atlas-Of-Thrones.git && cd ./Atlas-Of-Thronse/docker && docker-compose up -d


## 
- read top level README for details on AOT project written by @tristpa
