# Esto es la imagen de mi backend

# SO que va a usar mi imagen del back (El del backend que es el que estoy definiendo)
FROM ubuntu:24.04 
# Comandos que se van a ejecutar solo la 1 vez que se instancia el contenedor
RUN apt-get update
RUN apt-get install -y build-essential curl
# Instalo node
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g serve

# Instalo typescript
RUN npm install -g ts-node typescript
