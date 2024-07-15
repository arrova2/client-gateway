FROM node:21-alpine3.19

WORKDIR /usr/src/app

# COPY package*.json ./ lo mismo que las dos sentencias de abajo
COPY package.json ./
COPY package-lock.json ./

RUN npm install

# Copiamos todos los archivos al servidor
COPY . .

EXPOSE 3000