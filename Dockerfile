# Damn Vulnerable NodeJS Application
# docker run --name dvna -p 9090:9090 -d appsecco/dvna:sqlite

FROM node:carbon-slim
LABEL MAINTAINER "Appsecco Ops"

WORKDIR /opt

COPY package.json .

RUN npm install

WORKDIR /app

COPY . .

RUN apt-get update && \
    apt-get install -y iputils-ping

RUN npm install -g nodemon

ENV NODE_PATH=/opt/node_modules

CMD ["npm", "start"]
