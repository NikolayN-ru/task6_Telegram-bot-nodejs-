FROM node:16.16

WORKDIR /app

COPY . .

RUN npm i