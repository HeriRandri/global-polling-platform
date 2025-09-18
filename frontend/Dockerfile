FROM node:18-slim
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Build Next.js (SSG/SSR)
RUN npm run build

# Lancer Next.js en mode production
CMD ["npm", "run", "start"]

EXPOSE 3000
