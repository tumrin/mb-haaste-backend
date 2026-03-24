FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

CMD ["node", "--watch", "./src/index.ts"]
