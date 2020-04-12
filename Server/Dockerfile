FROM node:10

# Contacto de persona encargada de esta imagen:
MAINTAINER Bastian Santana "<bastian.santana@usach.cl>"

#dependencias básicas
RUN apt-get update -y
RUN apt-get install -y

# Working directory
RUN mkdir /usr/src/back-store
WORKDIR /usr/src/back-store

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm rebuild
RUN npm install

# Bundle app source
COPY . .
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 4000

CMD [ "node", "server/server.js" ]
