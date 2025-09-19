# backend/api/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# installe toutes les dépendances (dev + prod)
RUN npm install

COPY . .

# build du code TypeScript -> dist/
RUN npm run build

# commande de démarrage (prod)
CMD ["npm", "run", "start:prod"]
