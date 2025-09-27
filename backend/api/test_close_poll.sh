#!/bin/bash
set -e

echo "=== 🚀 Test Clôture de Sondage ==="

EMAIL="user$RANDOM@example.com"
PASSWORD="supersecure"

# 1. Register user
TOKEN=$(curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" | jq -r .accessToken)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Échec enregistrement user"
  exit 1
else
  echo "✅ Token reçu: $TOKEN"
fi
