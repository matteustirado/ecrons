FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4001

CMD ["npm", "start"]