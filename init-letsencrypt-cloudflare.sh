#!/bin/bash

if ! [ -x "$(command -v docker compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

domains=(DOMAIN_NAME www.DOMAIN_NAME)
rsa_key_size=4096
data_path="./nginx/certbot"
email="mmmohajer70@gmail.com"

echo "### Requesting Let's Encrypt DNS certificate for ${domains[@]} ..."

domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

docker compose -f ./docker-compose-create-ssl.yml run --rm certbot \
  sh -c "certbot certonly \
    --dns-cloudflare \
    --dns-cloudflare-credentials /cloudflare/cloudflare.ini \
    --dns-cloudflare-propagation-seconds 60 \
    $email_arg \
    $domain_args \
    --config-dir /etc/letsencrypt \
    --work-dir /tmp \
    --logs-dir /tmp \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal -v"


docker compose -f ./docker-compose-create-ssl.yml exec nginx nginx -s reload
