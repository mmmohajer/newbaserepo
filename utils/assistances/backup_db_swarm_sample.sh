#!/bin/bash

# Load DB credentials (adjust path if needed)
source /var/www/app/secrets/db/.env

DB_CONTAINER_ID=$(docker ps --filter "name=db" -q)

if [ ! -z "$DB_CONTAINER_ID" ]; then
    # Export password so pg_dump won’t ask for it
    export PGPASSWORD=$POSTGRES_PASSWORD
    
    docker exec -e PGPASSWORD=$POSTGRES_PASSWORD $DB_CONTAINER_ID \
      pg_dump -U $POSTGRES_USER $POSTGRES_DB > /var/www/app/db_backups/db_backup_$(date +%Y-%m-%d_%H-%M-%S).sql
    
    # Clean up old backups (15 days retention)
    find /var/www/app/db_backups -type f -mtime +15 -delete
    find /var/www/app/db_backups -type d -empty -delete
else
    echo "Error: DB Container not found."
fi
