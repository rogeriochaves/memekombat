FROM node:14

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

ENV PORT=3005
ENV NODE_ENV=production

COPY . .

CMD node web.js
