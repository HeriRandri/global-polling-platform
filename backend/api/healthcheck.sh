#!/bin/bash
set -e

echo "=== 🚑 Healthcheck Global Polling App ==="

# 1. Vérifier MySQL
echo -n "MySQL... "
if docker exec global-polling-platform-db-1 mysql -udev -pdevpass polling -e "SELECT 1;" &> /dev/null; then
  echo "✅ OK"
else
  echo "❌ FAIL"
fi

# 2. Vérifier Redis
echo -n "Redis... "
if docker exec global-polling-platform-redis-1 redis-cli PING | grep -q PONG; then
  echo "✅ OK"
else
  echo "❌ FAIL"
fi

# 3. Vérifier Backend direct
echo -n "Backend API (port 3001)... "
if curl -s http://localhost:3001/polls | grep -q "\["; then
  echo "✅ OK"
else
  echo "❌ FAIL"
fi

# 4. Vérifier Backend via Nginx
echo -n "Backend API via Nginx (http://localhost/api/polls)... "
if curl -s http://localhost/api/polls | grep -q "\["; then
  echo "✅ OK"
else
  echo "❌ FAIL"
fi

# 5. Vérifier Frontend
echo -n "Frontend (http://localhost)... "
if curl -s http://localhost | grep -q "<!DOCTYPE html>"; then
  echo "✅ OK"
else
  echo "❌ FAIL"
fi
