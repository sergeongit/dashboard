#!/bin/sh
set -eu

: "${BACKEND_URL:=http://backend:4000}"

BACKEND_HOST="${BACKEND_URL#http://}"
BACKEND_HOST="${BACKEND_HOST#https://}"

sed -e "s|__BACKEND_URL__|${BACKEND_URL}|g" \
    -e "s|__BACKEND_HOST__|${BACKEND_HOST}|g" \
  /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'