# frontend/Dockerfile
FROM node:18-slim

WORKDIR /app

COPY package*.json ./

# installe toutes les dépendances (incluant tailwind, postcss, etc.)
RUN npm install

COPY . .

# build Next.js (SSG/SSR)
RUN npm run build

# démarre Next.js en mode prod
CMD ["npm", "run", "start"]
