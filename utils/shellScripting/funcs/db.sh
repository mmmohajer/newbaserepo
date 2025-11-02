makeBackupOfDb() {
    echo "$POSTGRES_PASSWORD"
    local backupFileName=$(readData "What is backup filename  (without.sql)?")
    local addr="db_backups/$backupFileName.sql"
    docker exec -e PGPASSWORD=$POSTGRES_PASSWORD app-db-1 pg_dump $POSTGRES_DB -U $POSTGRES_USER > $addr
    echo "Backup file is ready"
}

restoreDb() {
    local restoreFileName=$(readData "What is restore filename (without.sql)?")
    local addr="db_backups/$restoreFileName.sql"
    docker exec -e PGPASSWORD=$POSTGRES_PASSWORD app-db-1 psql -U $POSTGRES_USER -d $POSTGRES_DB -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    docker exec -e PGPASSWORD=$POSTGRES_PASSWORD app-db-1 psql -U $POSTGRES_USER -d $POSTGRES_DB -f $addr
    echo "DB succsessfully restored"
}