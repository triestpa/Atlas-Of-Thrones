FROM node:8
MAINTAINER Martin Taheri <m3hran@gmail.com>
LABEL Description="AoT-backend Image"

    
RUN mkdir -p /u/apps && cd /u/apps && \
    git clone https://github.com/triestpa/Atlas-Of-Thrones.git

RUN cd /u/apps/Atlas-Of-Thrones && npm install
COPY bin/clean_install.sh /usr/local/bin/clean_install.sh
COPY bin/wait_for_postgres.sh /u/apps/Atlas-Of-Thrones/wait_for_postgres.sh

# Install packages
RUN apt-get -q update \
    && apt-get upgrade -y -o Dpkg::Options::="--force-confold"

RUN clean_install.sh --no-install-recommends \
    postgresql-client  

WORKDIR /u/apps/Atlas-Of-Thrones

EXPOSE 5000
ENTRYPOINT ./wait_for_postgres.sh aot_db && NODE_ENV=local npm start
