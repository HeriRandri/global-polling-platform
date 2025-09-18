#!/bin/bash

BACKUP_DIR=~/docker_backups/$(date +%Y-%m-%d)
mkdir -p "$BACKUP_DIR"

echo "=== Sauvegarde en cours dans $BACKUP_DIR ==="

docker exec global-polling-platform-db-1 \
  mysqldump -udev -pdevpass --no-tablespaces polling > "$BACKUP_DIR/mysql_dump.sql"

docker cp global-polling-platform-redis-1:/data/dump.rdb \
  "$BACKUP_DIR/redis_dump.rdb"

echo "✅ Backup terminé avec succès !"
