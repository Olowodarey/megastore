FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY apps/api/package.json ./
RUN npm install

COPY apps/api .

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/main.js"]
