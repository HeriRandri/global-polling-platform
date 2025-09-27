#!/bin/bash
echo "=== 🚀 Test règle '1 vote par utilisateur' ==="

# 1️⃣ Register user
EMAIL="user$RANDOM@example.com"
TOKEN=$(curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"supersecure\"}" | jq -r .accessToken)

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "❌ Registration failed"
  exit 1
fi
echo "✅ Token reçu: $TOKEN"

# 2️⃣ Create Poll + récupérer direct Option ID
POLL_RESPONSE=$(curl -s -X POST http://localhost:3001/polls \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Quel est ton framework préféré ?",
    "description": "Vote une seule fois",
    "options": ["NestJS", "Django", "Spring"]
  }')

POLL_ID=$(echo $POLL_RESPONSE | jq -r .id)
OPTION_ID=$(echo $POLL_RESPONSE | jq -r '.options[0].id')

echo "✅ Poll ID: $POLL_ID, First Option ID: $OPTION_ID"

# 3️⃣ First Vote (should work)
FIRST_VOTE=$(curl -s -X POST http://localhost:3001/votes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"pollId\":$POLL_ID,\"optionId\":$OPTION_ID}")

echo "✅ First vote response: $FIRST_VOTE"

# 4️⃣ Second Vote (should fail)
SECOND_VOTE=$(curl -s -X POST http://localhost:3001/votes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"pollId\":$POLL_ID,\"optionId\":$OPTION_ID}")

echo "❌ Second vote response: $SECOND_VOTE"

# 5️⃣ Get Results
RESULTS=$(curl -s http://localhost:3001/polls/$POLL_ID/results)
echo "=== Résultats ==="
echo $RESULTS | jq .
