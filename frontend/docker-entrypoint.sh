#!/bin/sh
set -eu

: "${BACKEND_URL:=http://backend:4000}"
sed "s|__BACKEND_URL__|${BACKEND_URL}|g" \
  /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
