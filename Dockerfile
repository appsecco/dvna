# Damn Vulnerable NodeJS Application
# docker run --name dvna -p 9090:9090 -d appsecco/dvna:sqlite

FROM node:carbon-slim
LABEL MAINTAINER "Subash SN"

WORKDIR /app

COPY . .

RUN apt-get update && \
    apt-get install -y iputils-ping
RUN npm install -g nodemon && \
    npm install

CMD ["npm", "start"]
