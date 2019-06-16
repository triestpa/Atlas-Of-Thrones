#!/bin/bash
# wait-for-postgres.sh

set -e

host="$1"

until PGPASSWORD=$(cat /run/secrets/postgres_passwd) psql -h "$host" -U "$(cat /run/secrets/postgres_user)"  -d "$(cat /run/secrets/postgres_db)"  -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up ---"
exit 0
