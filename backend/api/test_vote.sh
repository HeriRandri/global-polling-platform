#!/bin/bash
set -e

echo "=== 🚀 Test complet Vote ==="

# 1️⃣ Créer un user unique
EMAIL="user$RANDOM@example.com"
PASSWORD="supersecure"

echo "=== 1️⃣ Register user ($EMAIL) ==="
TOKEN=$(curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" | jq -r .accessToken)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Registration failed"
  exit 1
fi
echo "✅ Token reçu"

# 2️⃣ Créer un poll
echo "=== 2️⃣ Create Poll ==="
POLL=$(curl -s -X POST http://localhost:3001/polls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Quel est ton framework préféré ?",
    "description": "Vote une seule fois",
    "options": ["NestJS", "Django", "Spring"]
  }')

POLL_ID=$(echo $POLL | jq -r .id)
echo "✅ Poll ID: $POLL_ID"

# 3️⃣ Lister tous les polls
echo "=== 3️⃣ List all polls ==="
curl -s http://localhost:3001/polls | jq .

# 4️⃣ Voter (toujours sur la 1ère option)
OPTION_ID=$(curl -s http://localhost:3001/polls/$POLL_ID | jq -r .options[0].id)
echo "=== 4️⃣ Vote for option $OPTION_ID ==="
curl -s -X POST http://localhost:3001/votes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"pollId\":$POLL_ID,\"optionId\":$OPTION_ID}" | jq .


# 5️⃣ Résultats
echo "=== 5️⃣ Results ==="
curl -s http://localhost:3001/polls/$POLL_ID/results | jq .
