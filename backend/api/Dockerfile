FROM node:18-alpine

# Créer dossier de travail
WORKDIR /app

# Installer dépendances
COPY package*.json ./
RUN npm install --production

# Copier le code
COPY . .

# Compiler le code (NestJS → JS)
RUN npm run build

# Lancer le serveur
CMD ["npm", "run", "start:prod"]

EXPOSE 3001
