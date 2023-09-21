FROM node:lts-hydrogen

RUN apt-get update && apt-get install make wget -y

USER node

WORKDIR /usr/src/app