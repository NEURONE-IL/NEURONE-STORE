# This defines our starting point
FROM node:10

# Contacto de persona encargada de esta imagen:
MAINTAINER Bastian Santana "<bastian.santana@usach.cl>"

#dependencias básicas
RUN apt-get update -y
RUN apt-get install -y

# Working directory
RUN mkdir /usr/src/front-store
WORKDIR /usr/src/front-store

COPY . .

EXPOSE 4200

# Dependencies
RUN npm install -g @angular/cli@7.3.8
RUN npm install

# Serve the app
CMD ["npm", "start"]